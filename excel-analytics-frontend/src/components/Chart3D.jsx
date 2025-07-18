import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const Chart3D = ({ data, xAxis, yAxis }) => {
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)

  useEffect(() => {
    if (!data || !data.labels || !data.datasets?.[0]?.data) return

    // Cleanup previous scene
    if (sceneRef.current && rendererRef.current) {
      mountRef.current?.removeChild(rendererRef.current.domElement)
      rendererRef.current.dispose()
    }

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf0f0f0)
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000)
    camera.position.set(10, 10, 10)
    camera.lookAt(0, 0, 0)
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true })
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
    
    values.forEach((value, index) => {
      const barHeight = (value / maxValue) * 8
      
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
      context.fillText(data.labels[index], 10, 40)
      
      const texture = new THREE.CanvasTexture(canvas)
      const labelMaterial = new THREE.MeshBasicMaterial({ map: texture })
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
      
      camera.position.x = camera.position.x * Math.cos(deltaX * 0.01) - camera.position.z * Math.sin(deltaX * 0.01)
      camera.position.z = camera.position.x * Math.sin(deltaX * 0.01) + camera.position.z * Math.cos(deltaX * 0.01)
      camera.position.y += deltaY * 0.01
      
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
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    
    // Mount to DOM
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement)
      animate()
    }
    
    // Store references
    sceneRef.current = scene
    rendererRef.current = renderer
    
    // Cleanup
    return () => {
      renderer.domElement.removeEventListener('mousemove', onMouseMove)
      renderer.domElement.removeEventListener('mousedown', onMouseDown)
      renderer.domElement.removeEventListener('mouseup', onMouseUp)
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
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