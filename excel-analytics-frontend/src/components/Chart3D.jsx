import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const Chart3D = ({ data, xAxis, yAxis }) => {
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    if (!data || !data.labels || !data.datasets?.[0]?.data) {
      console.log('Chart3D: Missing required data', { data, xAxis, yAxis })
      return
    }

    console.log('Chart3D: Initializing with data', { 
      labels: data.labels, 
      values: data.datasets[0].data,
      xAxis, 
      yAxis 
    })

    // Cleanup previous scene
    if (rendererRef.current) {
      if (mountRef.current && rendererRef.current.domElement) {
        try {
          mountRef.current.removeChild(rendererRef.current.domElement)
        } catch (e) {
          console.warn('Chart3D: Error removing canvas:', e)
        }
      }
      rendererRef.current.dispose()
      rendererRef.current = null
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    // Check if mount point exists
    if (!mountRef.current) {
      console.warn('Chart3D: Mount point not available')
      return
    }

    try {
      // Scene setup
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0xf0f0f0)
      
      // Camera setup
      const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000)
      camera.position.set(10, 10, 10)
      camera.lookAt(0, 0, 0)
      
      // Renderer setup
      const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true
      })
      renderer.setSize(800, 600)
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      
      // Lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
      scene.add(ambientLight)
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
      directionalLight.position.set(10, 10, 5)
      directionalLight.castShadow = true
      scene.add(directionalLight)
      
      // Create 3D bars
      const values = data.datasets[0].data
      const maxValue = Math.max(...values)
      const barWidth = 0.8
      const barSpacing = 1.2
      
      console.log('Chart3D: Creating bars', { values, maxValue })
      
      values.forEach((value, index) => {
        const barHeight = maxValue > 0 ? (value / maxValue) * 8 : 0.1
        
        // Bar geometry
        const geometry = new THREE.BoxGeometry(barWidth, barHeight, barWidth)
        const material = new THREE.MeshLambertMaterial({ 
          color: `hsl(${(index * 360) / values.length}, 70%, 50%)` 
        })
        
        const bar = new THREE.Mesh(geometry, material)
        bar.position.set(
          (index - values.length / 2) * barSpacing,
          barHeight / 2,
          0
        )
        bar.castShadow = true
        bar.receiveShadow = true
        
        scene.add(bar)
        
        // Add label
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.width = 256
        canvas.height = 64
        context.fillStyle = '#000000'
        context.font = '24px Arial'
        context.textAlign = 'center'
        context.fillText(String(data.labels[index]), 128, 40)
        
        const texture = new THREE.CanvasTexture(canvas)
        const labelMaterial = new THREE.MeshBasicMaterial({ 
          map: texture,
          transparent: true 
        })
        const labelGeometry = new THREE.PlaneGeometry(2, 0.5)
        const label = new THREE.Mesh(labelGeometry, labelMaterial)
        label.position.set(
          (index - values.length / 2) * barSpacing,
          -1,
          0
        )
        label.lookAt(camera.position)
        
        scene.add(label)
      })
      
      // Add grid
      const gridHelper = new THREE.GridHelper(20, 20)
      scene.add(gridHelper)
      
      // Mouse controls
      let mouseX = 0
      let mouseY = 0
      let isMouseDown = false
      
      const onMouseMove = (event) => {
        if (!isMouseDown) return
        
        const deltaX = event.clientX - mouseX
        const deltaY = event.clientY - mouseY
        
        // Simple rotation around Y axis
        const angle = deltaX * 0.01
        const radius = Math.sqrt(camera.position.x * camera.position.x + camera.position.z * camera.position.z)
        camera.position.x = radius * Math.cos(angle)
        camera.position.z = radius * Math.sin(angle)
        camera.position.y = Math.max(2, camera.position.y + deltaY * 0.01)
        
        camera.lookAt(0, 0, 0)
        
        mouseX = event.clientX
        mouseY = event.clientY
      }
      
      const onMouseDown = (event) => {
        isMouseDown = true
        mouseX = event.clientX
        mouseY = event.clientY
      }
      
      const onMouseUp = () => {
        isMouseDown = false
      }
      
      renderer.domElement.addEventListener('mousemove', onMouseMove)
      renderer.domElement.addEventListener('mousedown', onMouseDown)
      renderer.domElement.addEventListener('mouseup', onMouseUp)
      
      // Animation loop
      const animate = () => {
        animationRef.current = requestAnimationFrame(animate)
        renderer.render(scene, camera)
      }
      
      // Mount to DOM
      const mountElement = mountRef.current
      mountElement.appendChild(renderer.domElement)
      animate()
      
      // Store references
      sceneRef.current = scene
      rendererRef.current = renderer
      
      console.log('Chart3D: Successfully initialized')
      
      // Cleanup function
      return () => {
        console.log('Chart3D: Cleaning up')
        
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
          animationRef.current = null
        }
        
        renderer.domElement.removeEventListener('mousemove', onMouseMove)
        renderer.domElement.removeEventListener('mousedown', onMouseDown)
        renderer.domElement.removeEventListener('mouseup', onMouseUp)
        
        if (mountElement && renderer.domElement && mountElement.contains(renderer.domElement)) {
          mountElement.removeChild(renderer.domElement)
        }
        
        renderer.dispose()
      }
      
    } catch (error) {
      console.error('Chart3D: Error initializing:', error)
    }
  }, [data, xAxis, yAxis])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div 
        ref={mountRef} 
        className="border border-gray-300 rounded-lg overflow-hidden"
        style={{ width: '800px', height: '600px' }}
      />
    </div>
  )
}

export default Chart3D