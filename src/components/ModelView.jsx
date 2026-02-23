import { OrbitControls, PerspectiveCamera, View } from '@react-three/drei'
import { useRef, memo } from 'react'
import { Vector3 } from 'three'
import Lights from './Lights'
import { Suspense } from 'react'
import IPhone from './IPhone'
import Loader from './Loader'

// Target vector outside component so it's never recreated on re-renders
const ORBIT_TARGET = new Vector3(0, 0, 0)

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
      <group ref={groupRef} name={`${index === 1 ? 'small' : 'large'}`} position={[0, 0, 0]}>
        <Suspense fallback={<Loader />}>
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

// memo prevents re-render when parent re-renders but props haven't changed
export default memo(ModelView)