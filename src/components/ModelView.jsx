import { OrbitControls, PerspectiveCamera, View, Html } from '@react-three/drei'
import { useRef, memo } from 'react'
import { Vector3 } from 'three'
import Lights from './Lights'
import { Suspense } from 'react'
import IPhone from './IPhone'

// Target vector outside component so it's never recreated on re-renders
const ORBIT_TARGET = new Vector3(0, 0, 0)

// Simple Three.js-compatible loader using Html from drei
// Cannot use regular React components (like the full-screen Loader) inside Canvas
const ModelLoader = () => (
  <Html center>
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      <p className="text-white text-sm font-light">Loading model...</p>
    </div>
  </Html>
)

const ModelView = ({
  index,
  groupRef,
  gsapType,
  controlRef,
  setRotationState,
  size,
  item,
}) => {
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
      <group ref={groupRef} name={`${index === 1 ? 'small' : 'large'}`} position={[0, 0, 0]}>
        <Suspense fallback={<ModelLoader />}>
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