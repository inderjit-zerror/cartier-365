import HomeInner from '../components/HomeInner'
import video1 from '/main-video.mp4' 


const HomePage = () => {
  return (
    <>
      <div className='w-full min-h-screen flex relative'>
        <div className='w-full h-screen fixed top-0 left-0 bg-red-900 z-10'>
            <video autoPlay muted loop className='w-full h-full object-cover' src={video1}></video>
        </div>
        <HomeInner/>
      </div>
    </>
  )
}

export default HomePage
