import { PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Vertex from "../shaders/Vertex.glsl";
import Fragment from "../shaders/Fragment.glsl";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

const HomeInner = () => {
  // ======================================== DATA
  const Distance = 200;
  // const topCont1 = useRef();
  const meshRef = useRef();
  const uIntroCurve = useRef({ value: 0 });
  const canvasRef = useRef();

  // ======================================== R3F FUNCTIONS
  const MESH = ({ top }) => {
    // Compute plane size based on screen
    const { width, height } = useMemo(() => {
      const aspect = window.innerWidth / window.innerHeight;
      const FOV =
        2 * Math.atan(window.innerHeight / 2 / Distance) * (180 / Math.PI);

      const visibleHeight =
        2 * Math.tan((FOV / 2) * (Math.PI / 180)) * Distance;
      const visibleWidth = visibleHeight * aspect;

      // 80% of visible area
      return {
        width: visibleWidth * 0.7,
        height: visibleHeight * 0.7,
      };
    }, []);

    // ===================================================== PreLoading

    // PreLoading
    useEffect(() => {
      document.body.classList.add("scroll-lock");
      gsap.set(canvasRef.current, {
        position: "absolute",
        top: "-2%",
        left: 0,
      });
      gsap.set(meshRef.current.scale, {
        x: 1.43,
        ease: "power1.inOut",
      });

      const preTL = gsap.timeline();

      preTL.to(
        uIntroCurve.current,
        {
          value: 1.0,
          delay: 0.05,
          ease: "power2.inOut",
        },
        "pre1"
      );
      preTL.to(
        meshRef.current.scale,
        {
          x: 1,
          duration: 1.5,
          ease: "power2.inOut",
        },
        "pre1"
      );
      preTL.to(
        uIntroCurve.current,
        {
          value: 0,
          delay: 0.8,
          duration: 0.5,
          ease: "power2.inOut",
        },
        "pre1"
      );
      preTL.to(
        canvasRef.current,
        {
          y: "81.5%",
          duration: 1.5,
          ease: "power2.inOut",
          onComplete: () => {
            gsap.set(canvasRef.current, {
              clearProps: "position,top,left,transform",
            });
            document.body.classList.remove("scroll-lock");
            ScrollTrigger.refresh();
          },
        },
        "pre1"
      );
    }, []);

    // =====================================================

    // Scroll-Animation
    useEffect(() => {
      // ========================================= 70% to 100%
      const tl1 = gsap.timeline({
        scrollTrigger: {
          trigger: `.${top}`,
          start: "top 80%",
          end: "top top",
          scrub: true,
          // markers: true,
        },
      });
      tl1.to(meshRef.current.scale, {
        x: 1.43,
        ease: "power1.inOut",
      });

      // ========================================= 100% to 70%

      const tl2 = gsap.timeline({
        scrollTrigger: {
          trigger: `.${top}`,
          start: "bottom 80%",
          end: "bottom top",
          scrub: true,
          // markers: true,
        },
      });
      tl2.to(meshRef.current.scale, {
        x: 1,
        ease: "power1.inOut",
      });
    }, []);

    //  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // -------------------- SCROLL SPEED DETECTION --------------------
    const uScrollSpeed = useRef({ value: 0 }); // shared uniform for all meshes
    const scrollVelocity = useRef(0);
    const uScrollDir = useRef({ value: 1.0 }); // 88888888888888888888888888888

    useEffect(() => {
      const handleWheel = (e) => {

        // Direction detection
        if (e.deltaY > 0) {
          uScrollDir.current.value = -1.0; // scroll down 88888888888888888888888888888888
        } else if (e.deltaY < 0) {
          uScrollDir.current.value = 1.0; // scroll up 88888888888888888888888888888888
        }

                // Use the actual scroll delta speed
        const delta = Math.abs(e.deltaY);

        // Normalize speed
        const speed = Math.min(delta / 100, 3.0); // 0 to 3 range


        scrollVelocity.current = speed;
      };

      window.addEventListener("wheel", handleWheel, { passive: true });
      window.addEventListener(
        "touchmove",
        (e) => {
          scrollVelocity.current = 1.0; // approximate touch move
        },
        { passive: true }
      );

      return () => {
        window.removeEventListener("wheel", handleWheel);
        window.removeEventListener("touchmove", handleWheel);
      };
    }, []);

    // -------------------- UPDATE UNIFORM EVERY FRAME --------------------
    useFrame(() => {
      uScrollSpeed.current.value +=
        (scrollVelocity.current - uScrollSpeed.current.value) * 0.1;

      scrollVelocity.current *= 0.9;
    });
    //  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    return (
      <mesh ref={meshRef}>
        <planeGeometry args={[width, window.innerHeight - 80, 400, 400]} />{" "}
        {/* REMOVE - 50 */}
        <shaderMaterial
          vertexShader={Vertex}
          fragmentShader={Fragment}
          uniforms={{
            uScrollSpeed: uScrollSpeed.current,
            uScrollDir: uScrollDir.current, // 888888888888888888888888888
            uIntroCurve: uIntroCurve.current,
          }}
        />
      </mesh>
    );
  };

  const Sceen = ({ top }) => {
    const FOV =
      2 * Math.atan(window.innerHeight / 2 / Distance) * (180 / Math.PI);
    return (
      <>
        <PerspectiveCamera makeDefault fov={FOV} position={[0, 0, Distance]} />
        <MESH top={top} />
      </>
    );
  };

  // ======================================== NORMAL FUNCTIONS
  const BlankDiv = () => {
    return <div className="w-full h-[80dvh]"></div>;
  };

  const MainComponents = ({ top }) => {
    return (
      <>
        <div
          // ref={topCont1}
          className={`topCont ${top} w-full min-h-screen flex justify-center`}
          // H-full
        >
          {/* Inner-Cont & Canvas */}
          <div
            ref={canvasRef}
            className={`CanvasCont w-full h-[115dvh] flex justify-center`}
          >
            {/* H-full */}
            <Canvas
              className="w-full h-full "
              gl={{
                antialias: true,
                powerPreference: "high-performance",
                alpha: true,
              }}
              dpr={[1, 2]}
            >
              <Sceen top={top} />
            </Canvas>
          </div>
        </div>
      </>
    );
  };

  // ======================================== CALL

  return (
    <>
      <div className="w-full min-h-screen z-20">
        <BlankDiv />
        <MainComponents top="Section1" />

        {/* 2 */}
        <BlankDiv />
        <MainComponents top="Section2" />

        {/* 3 */}
        <BlankDiv />
        <MainComponents top="Section3" />

        {/* Just-Blank Div */}
        <BlankDiv />
      </div>
    </>
  );
};

export default HomeInner;
