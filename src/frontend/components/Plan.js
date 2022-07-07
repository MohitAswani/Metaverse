const Plane = () => {
  return (
    <mesh position={[0, 0, 0]}>
      <planeBufferGeometry attack="geometry" args={[50, 50]} />
      <meshStandardMaterial color={"#404040"} />
    </mesh>
  );
};
