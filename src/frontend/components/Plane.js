const Plane = () => {

  // We are using 3js to create this plane.

  // To create an object in 3js we need to have 2 things : 1) Geometry 2) Material

  // position gives the x,y,z position in the plane that we are going to have.

  // args in geometry will give the width and height.
  return (
    <mesh position={[0, 0, 0]}>
      <planeBufferGeometry attack="geometry" args={[50, 50]} />
      <meshStandardMaterial color={"#404040"} />
    </mesh>
  );
};

export default Plane;