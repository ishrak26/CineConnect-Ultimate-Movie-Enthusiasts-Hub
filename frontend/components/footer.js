
export default function Footer() {
  return (

    <div>
      <div className="flex flex-col text-[#737373] px-14 md:px-28 lg:px-40 xl:px-6 mt-14">
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 my-4">
          <li className="my-1 md:mr-4 hover:underline cursor-pointer text-lg font-medium">
            FAQ
          </li>
          <li className="my-1 md:mr-4 hover:underline cursor-pointer text-lg font-medium">
            Investor Relations
          </li>
          <li className="my-1 md:mr-4 hover:underline cursor-pointer text-lg font-medium">
            Privacy
          </li>
          <li className="my-1 md:mr-4 hover:underline cursor-pointer text-lg font-medium">
            Speed Test
          </li>
          <li className="my-1 md:mr-4 hover:underline cursor-pointer text-base font-medium">
            Help Centre
          </li>
          <li className="my-1 md:mr-4 hover:underline cursor-pointer text-base font-medium">
            Jobs
          </li>
          <li className="my-1 md:mr-4 hover:underline cursor-pointer text-base font-medium">
            Cookie Preferences
          </li>
          <li className="my-1 md:mr-4 hover:underline cursor-pointer text-base font-medium">
            Legal Notices
          </li>
          <li className="my-1 md:mr-4 hover:underline cursor-pointer text-base font-medium">
            Account
          </li>
          <li className="my-1 md:mr-4 hover:underline cursor-pointer text-base font-medium">
            Ways to Watch
          </li>
          <li className="my-1 md:mr-4 hover:underline cursor-pointer text-base font-medium">
            Corporate Information
          </li>
          <li className="my-1 md:mr-4 hover:underline cursor-pointer text-base font-medium">
            Only on <span className="text-white">CineConnect</span>
          </li>
          <li className="my-1 md:mr-4 hover:underline cursor-pointer text-base font-medium">
            Media Centre
          </li>
          <li className="my-1 md:mr-4 hover:underline cursor-pointer text-base font-medium">
            Terms of Use
          </li>
          <li className="my-1 md:mr-4 hover:underline cursor-pointer text-base font-medium">
            {" "}
            <a href="https://www.linkedin.com/in/naveen-polasa/">
              Contact Us
            </a>{" "}
          </li>
        </ul>
        <button className="flex justify-center items-center font-medium h-12 w-36 border border-[#737373]">

          English
        </button>
        <p className="my-4 text-sm font-medium">
          <span className="text-white">CineConnect</span>
        </p>

      </div>

      <div className="h-9 py-1 text-white text-center bg-[#333333]">
        For Educational Purposes Only
      </div>
    </div>
  )
}
