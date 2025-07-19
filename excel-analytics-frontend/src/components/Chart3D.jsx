import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const Chart3D = ({ data, xAxis, yAxis }) => {
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const animationRef = useRef(null)
  const cameraRef = useRef(null)

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
      // Get container dimensions for responsive sizing
      const container = mountRef.current
      const containerWidth = container.clientWidth
      const containerHeight = container.clientHeight
      
      // Scene setup
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0xf8fafc)
      
      // Camera setup with responsive aspect ratio
      const camera = new THREE.PerspectiveCamera(75, containerWidth / containerHeight, 0.1, 1000)
      camera.position.set(12, 12, 12)
      camera.lookAt(0, 0, 0)
      cameraRef.current = camera
      
      // Renderer setup with responsive sizing
      const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true
      })
      renderer.setSize(containerWidth, containerHeight)
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      renderer.setClearColor(0xf8fafc, 1)
      
      // Enhanced lighting setup
      const ambientLight = new THREE.AmbientLight(0x404040, 0.4)
      scene.add(ambientLight)
      
      const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8)
      directionalLight1.position.set(10, 10, 5)
      directionalLight1.castShadow = true
      directionalLight1.shadow.mapSize.width = 1024
      directionalLight1.shadow.mapSize.height = 1024
      scene.add(directionalLight1)
      
      const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4)
      directionalLight2.position.set(-10, 10, -5)
      scene.add(directionalLight2)
      
      // Create 3D bars with enhanced styling
      const values = data.datasets[0].data
      const maxValue = Math.max(...values)
      const barWidth = 0.6
      const barSpacing = 1.0
      
      console.log('Chart3D: Creating bars', { values, maxValue })
      
      values.forEach((value, index) => {
        const barHeight = maxValue > 0 ? (value / maxValue) * 8 : 0.1
        
        // Create gradient material
        const hue = (index * 360) / values.length
        const color = new THREE.Color(`hsl(${hue}, 70%, 60%)`)
        
        // Bar geometry with rounded top
        const geometry = new THREE.CylinderGeometry(barWidth/2, barWidth/2, barHeight, 8)
        const material = new THREE.MeshPhongMaterial({ 
          color: color,
          shininess: 100,
          specular: 0x222222
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
        
        // Enhanced label with better visibility
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.width = 256
        canvas.height = 64
        
        // Create gradient background for label
        const gradient = context.createLinearGradient(0, 0, 256, 64)
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)')
        gradient.addColorStop(1, 'rgba(240, 240, 240, 0.9)')
        
        context.fillStyle = gradient
        context.fillRect(0, 0, 256, 64)
        
        context.fillStyle = '#1f2937'
        context.font = 'bold 18px Arial'
        context.textAlign = 'center'
        context.fillText(String(data.labels[index]), 128, 25)
        
        // Add value below label
        context.font = '14px Arial'
        context.fillStyle = '#6b7280'
        context.fillText(value.toString(), 128, 45)
        
        const texture = new THREE.CanvasTexture(canvas)
        const labelMaterial = new THREE.MeshBasicMaterial({ 
          map: texture,
          transparent: true,
          side: THREE.DoubleSide
        })
        const labelGeometry = new THREE.PlaneGeometry(1.5, 0.375)
        const label = new THREE.Mesh(labelGeometry, labelMaterial)
        label.position.set(
          (index - values.length / 2) * barSpacing,
          -1.5,
          0
        )
        label.lookAt(camera.position)
        
        scene.add(label)
      })
      
      // Enhanced grid with better styling
      const gridHelper = new THREE.GridHelper(values.length * barSpacing + 2, 10, 0xcccccc, 0xeeeeee)
      gridHelper.position.y = -2
      scene.add(gridHelper)
      
      // Add axes labels
      const createAxisLabel = (text, position, rotation) => {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        canvas.width = 256
        canvas.height = 64
        
        context.fillStyle = '#374151'
        context.font = 'bold 20px Arial'
        context.textAlign = 'center'
        context.fillText(text, 128, 40)
        
        const texture = new THREE.CanvasTexture(canvas)
        const material = new THREE.MeshBasicMaterial({ 
          map: texture,
          transparent: true 
        })
        const geometry = new THREE.PlaneGeometry(2, 0.5)
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.copy(position)
        if (rotation) mesh.rotation.copy(rotation)
        
        scene.add(mesh)
      }
      
      // Add axis labels
      createAxisLabel(xAxis || 'X-Axis', new THREE.Vector3(0, -2.5, -values.length/2 - 2))
      createAxisLabel(yAxis || 'Y-Axis', new THREE.Vector3(-values.length/2 - 2, 4, 0), new THREE.Euler(0, Math.PI/2, 0))
      
      // Enhanced mouse controls with smooth rotation
      let isMouseDown = false
      let mouseX = 0
      let mouseY = 0
      let targetRotationX = 0
      let targetRotationY = 0
      let currentRotationX = 0
      let currentRotationY = 0
      
      const onMouseMove = (event) => {
        if (!isMouseDown) return
        
        const deltaX = event.clientX - mouseX
        const deltaY = event.clientY - mouseY
        
        targetRotationX += deltaY * 0.005
        targetRotationY += deltaX * 0.005
        
        // Limit vertical rotation
        targetRotationX = Math.max(-Math.PI/2, Math.min(Math.PI/2, targetRotationX))
        
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
      
      const onWheel = (event) => {
        event.preventDefault()
        const scale = event.deltaY > 0 ? 1.1 : 0.9
        camera.position.multiplyScalar(scale)
        
        // Limit zoom
        const distance = camera.position.length()
        if (distance > 50) camera.position.normalize().multiplyScalar(50)
        if (distance < 5) camera.position.normalize().multiplyScalar(5)
      }
      
      renderer.domElement.addEventListener('mousemove', onMouseMove)
      renderer.domElement.addEventListener('mousedown', onMouseDown)
      renderer.domElement.addEventListener('mouseup', onMouseUp)
      renderer.domElement.addEventListener('wheel', onWheel)
      
      // Smooth animation loop
      const animate = () => {
        animationRef.current = requestAnimationFrame(animate)
        
        // Smooth rotation interpolation
        currentRotationX += (targetRotationX - currentRotationX) * 0.1
        currentRotationY += (targetRotationY - currentRotationY) * 0.1
        
        // Apply rotation around the scene center
        const radius = Math.sqrt(camera.position.x * camera.position.x + camera.position.z * camera.position.z)
        camera.position.x = radius * Math.cos(currentRotationY)
        camera.position.z = radius * Math.sin(currentRotationY)
        camera.position.y = Math.max(2, 15 + Math.sin(currentRotationX) * 10)
        
        camera.lookAt(0, 0, 0)
        
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
      
      // Handle resize
      const handleResize = () => {
        if (!camera || !renderer || !mountElement) return
        
        const newWidth = mountElement.clientWidth
        const newHeight = mountElement.clientHeight
        
        camera.aspect = newWidth / newHeight
        camera.updateProjectionMatrix()
        renderer.setSize(newWidth, newHeight)
      }
      
      window.addEventListener('resize', handleResize)
      
      // Cleanup function
      return () => {
        console.log('Chart3D: Cleaning up')
        
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
          animationRef.current = null
        }
        
        window.removeEventListener('resize', handleResize)
        renderer.domElement.removeEventListener('mousemove', onMouseMove)
        renderer.domElement.removeEventListener('mousedown', onMouseDown)
        renderer.domElement.removeEventListener('mouseup', onMouseUp)
        renderer.domElement.removeEventListener('wheel', onWheel)
        
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
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 rounded-lg">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">3D Chart Visualization</h3>
        <p className="text-sm text-gray-600">
          Drag to rotate • Scroll to zoom • {xAxis} vs {yAxis}
        </p>
      </div>
      <div 
        ref={mountRef} 
        className="border-2 border-gray-300 rounded-xl overflow-hidden shadow-lg bg-white"
        style={{ width: '100%', height: '500px', minHeight: '400px', maxWidth: '800px' }}
      />
      <div className="mt-4 text-xs text-gray-500 text-center max-w-md">
        Interactive 3D visualization of your data. Use mouse controls to explore different angles.
      </div>
    </div>
  )
}

export default Chart3D