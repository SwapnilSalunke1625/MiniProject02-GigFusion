<div style={{ 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  height: '100vh', 
  width: '100%', 
  position: 'relative' 
}}>
  {/* Background Particles */}
  <div style={{ 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    width: '100%', 
    height: '100%', 
    zIndex: -1 
  }}>
    {/* Paste your Particles code here */}
    <Particles
      particleColors={['#ffffff', '#ffffff']}
      particleCount={200}
      particleSpread={10}
      speed={0.1}
      particleBaseSize={100}
      moveParticlesOnHover={true}
      alphaParticles={false}
      disableRotation={false}
    />
  </div>

  {/* Centered Content */}
  <div style={{ 
    zIndex: 1, 
    background: 'rgba(0, 0, 0, 0.7)', 
    padding: '20px', 
    borderRadius: '10px', 
    color: '#fff', 
    textAlign: 'center' 
  }}>
    <h1>Your Main Content</h1>
    <p>This will be centered on the page.</p>
  </div>
</div>
