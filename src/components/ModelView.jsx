import { OrbitControls, PerspectiveCamera, View, Html, useProgress } from '@react-three/drei'
import { memo, Suspense } from 'react'
import { Vector3 } from 'three'
import { useGLTF } from '@react-three/drei'
import Lights from './Lights'
import IPhone from './IPhone'
import { sceneGlb } from '../utils'

const ORBIT_TARGET = new Vector3(0, 0, 0)

const CanvasLoader = () => {
  const { progress } = useProgress()
  return (
    <Html center>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <span className="canvas-loader" />
        <p style={{ color: '#fff', fontSize: 13, fontWeight: 600, marginTop: 40 }}>
          {progress > 0 ? `${progress.toFixed(0)}%` : 'Loading...'}
        </p>
      </div>
    </Html>
  )
}

const ModelView = ({ index, groupRef, gsapType, controlRef, setRotationState, size, item }) => {
  return (
    <View
      index={index}
      id={gsapType}
      className={`w-full h-full absolute ${index === 2 ? 'right-[-100%]' : ''}`}
    >
      <ambientLight intensity={0.3} />
      <PerspectiveCamera makeDefault position={[0, 0, 4]} />
      <Lights />
      <OrbitControls
        makeDefault
        ref={controlRef}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.4}
        target={ORBIT_TARGET}
        onEnd={() => setRotationState(controlRef.current.getAzimuthalAngle())}
      />
      <group ref={groupRef} name={index === 1 ? 'small' : 'large'} position={[0, 0, 0]}>
        <Suspense fallback={<CanvasLoader />}>
          <IPhone
            scale={index === 1 ? [15, 15, 15] : [17, 17, 17]}
            item={item}
            size={size}
          />
        </Suspense>
      </group>
    </View>
  )
}

export default memo(ModelView)