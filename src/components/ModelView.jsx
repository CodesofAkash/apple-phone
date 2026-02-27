import { OrbitControls, PerspectiveCamera, View, Html, useProgress } from '@react-three/drei'
import { memo } from 'react'
import { Vector3 } from 'three'
import Lights from './Lights'
import { Suspense } from 'react'
import IPhone from './IPhone'

const ORBIT_TARGET = new Vector3(0, 0, 0)

// Must be rendered inside Canvas/View context — uses Html from drei
// Regular React spinner won't work here
const CanvasLoader = () => {
  const { progress } = useProgress()
  return (
    <Html
      as="div"
      center
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <span className="canvas-loader" />
      <p
        style={{
          fontSize: 14,
          color: '#F1F1F1',
          fontWeight: 800,
          marginTop: 40,
        }}
      >
        {progress !== 0 ? `${progress.toFixed(2)}%` : 'Loading...'}
      </p>
    </Html>
  )
}

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