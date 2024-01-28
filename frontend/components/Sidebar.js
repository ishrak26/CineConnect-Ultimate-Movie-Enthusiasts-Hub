import Image from "next/image";
import { AiOutlineHome } from "react-icons/ai";
import { BsPeople } from "react-icons/bs";
import { TiContacts } from "react-icons/ti";
import { FiMail } from "react-icons/fi";
import { RiCompassDiscoverLine } from "react-icons/ri";
import { RiMovie2Line } from "react-icons/ri";
import { MdOutlineForum } from "react-icons/md";
import { BsChatDots } from "react-icons/bs";
import { FiShoppingCart } from "react-icons/fi";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import Link from "next/link";
import { useContext } from "react";
import { useRouter } from "next/router";
import { SidebarContext } from "../context/SidebarContext";

const sidebarItems = [
  {
    name: "Home",
    href: "/",
    icon: AiOutlineHome,
  },
  {
    name: "Discover",
    href: "/discover",
    icon: RiCompassDiscoverLine,
  },
  {
    name: "Movie",
    href: "/movie",
    icon: RiMovie2Line,
  },
  {
    name: "Celebrity",
    href: "/celebrity",
    icon: BsPeople,
  },
  {
    name: "Forum",
    href: "/forum",
    icon: MdOutlineForum,
  },
  {
    name: "Chat",
    href: "/chat",
    icon: BsChatDots,
  },
  {
    name: "Marketplace",
    href: "/marketplace",
    icon: FiShoppingCart,
  },
  {
    name: "About",
    href: "/about",
    icon: TiContacts,
  },

];

const Sidebar = () => {
  const router = useRouter();
  const { isCollapsed, toggleSidebarcollapse } = useContext(SidebarContext);

  return (
    <div className="sidebar__wrapper">
      <button className="btn" onClick={toggleSidebarcollapse}>
        {isCollapsed ? <MdKeyboardArrowRight /> : <MdKeyboardArrowLeft />}
      </button>
      <aside className="sidebar" data-collapse={isCollapsed}>
        {/* <div className="sidebar__top">

          <p className="sidebar__logo-name">CineConnect</p>
        </div> */}
        <ul className="sidebar__list">
          {sidebarItems.map(({ name, href, icon: Icon }) => {
            return (
              <li className="sidebar__item" key={name}>
                <Link
                  className={`sidebar__link ${router.pathname === href ? "sidebar__link--active" : ""
                    }`}
                  href={href}
                >
                  <span className="sidebar__icon">
                    <Icon />
                  </span>
                  <span className="sidebar__name">{name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;