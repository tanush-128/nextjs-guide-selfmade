export default function home() {
  return (
    <div className="flex flex-col w-full  justify-center items-center parent">
    <div className="py-4 font-bold text-xl">
  Frippi
  </div>
  <div className="flex flex-col gap-3">


    <input  type="text" placeholder="Name" />


    <input  type="email" placeholder="Enter your Email Address" />
   <div className="flex justify-evenly">
    Gender :
    <div>
    <input  type="radio" placeholder="Select Gender" />
    Male
    </div>
    <div>
    <input  type="radio" placeholder="Select Gender" />
    Female
    </div>

   </div>
    <input  type="password" placeholder="Password" />
    <input  type="password" placeholder="Re-enter Password" />

  <button> Sign Up</button>
  </div>
  <div className="py-6">
    Already a member? <a href="/login" className="text-blue-600 font-bold">Login</a>
  </div>
  </div>

  )
}