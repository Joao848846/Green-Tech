import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Icons, APP_MODULES, NavItemType, ModuleType } from "../../constants";

interface ModuleNavItemProps {
  module: ModuleType;
  isActiveModule: boolean;
}

const ModuleNavItem: React.FC<ModuleNavItemProps> = ({
  module,
  isActiveModule,
}) => {
  // For the main module link, navigate to the first sub-item's path or its base path.
  const moduleLinkTarget =
    module.subItems.length > 0 ? module.subItems[0].to : module.basePath;

  return (
    <NavLink
      to={moduleLinkTarget}
      className={(
        { isActive } // isActive here refers to NavLink's own check for the target path
      ) =>
        `flex items-center px-4 py-3 space-x-3 rounded-lg transition-all duration-200 ease-in-out group
         ${
           isActiveModule || isActive // Highlight if it's the active module OR if the NavLink target is active
             ? "bg-futuristic-primary/20 text-futuristic-accent shadow-lg"
             : "text-futuristic-text-secondary hover:bg-futuristic-bg-secondary hover:text-futuristic-text"
         }`
      }
    >
      <span
        className={`w-6 h-6 ${isActiveModule ? "text-futuristic-accent" : "group-hover:text-futuristic-accent"} transition-colors duration-200`}
      >
        {module.icon}
      </span>
      <span className="font-medium group-hover:tracking-wider transition-all duration-200">
        {module.label}
      </span>
    </NavLink>
  );
};

interface SubNavItemProps {
  item: NavItemType;
}

const SubNavItem: React.FC<SubNavItemProps> = ({ item }) => {
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        `flex items-center pl-10 pr-4 py-2.5 space-x-3 rounded-md transition-all duration-150 ease-in-out group text-sm
         ${
           isActive
             ? "bg-futuristic-primary/10 text-futuristic-accent font-medium"
             : "text-futuristic-text-secondary hover:bg-futuristic-bg-secondary/70 hover:text-futuristic-text"
         }`
      }
      end={item.exact !== undefined ? item.exact : true}
    >
      <span className="w-5 h-5 group-hover:text-futuristic-accent transition-colors duration-150">
        {item.icon}
      </span>
      <span className="group-hover:tracking-normal transition-all duration-150">
        {item.label}
      </span>
    </NavLink>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const activeModule = APP_MODULES.find((module) =>
    location.pathname.startsWith(module.basePath)
  );

  return (
    <aside className="w-72 bg-futuristic-bg-secondary p-6 space-y-6 shadow-2xl flex flex-col border-r border-futuristic-primary/20">
      <div>
        <h1 className="text-3xl font-orbitron text-futuristic-primary text-center mb-2">
          A D M I N
        </h1>
        <p className="text-xs text-futuristic-text-secondary text-center tracking-widest">
          PAINEL V1.2
        </p>
      </div>

      <nav className="flex-grow space-y-1">
        {/* Dashboard Link */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 space-x-3 rounded-lg transition-all duration-200 ease-in-out group
            ${
              isActive
                ? "bg-futuristic-primary/20 text-futuristic-accent shadow-lg"
                : "text-futuristic-text-secondary hover:bg-futuristic-bg-secondary hover:text-futuristic-text"
            }`
          }
        >
          <span className="w-6 h-6 group-hover:text-futuristic-accent transition-colors duration-200">
            <Icons.Home className="w-5 h-5" />
          </span>
          <span className="font-medium group-hover:tracking-wider transition-all duration-200">
            Dashboard
          </span>
        </NavLink>

        <hr className="border-futuristic-primary/10 my-4" />

        {/* Module Links */}
        {APP_MODULES.map((module) => (
          <ModuleNavItem
            key={module.id}
            module={module}
            isActiveModule={activeModule?.id === module.id}
          />
        ))}

        {/* Active Module Sub-items */}
        {activeModule && activeModule.subItems.length > 0 && (
          <>
            <hr className="border-futuristic-primary/10 my-3" />
            <div className="space-y-1 pt-2">
              <h3 className="px-4 text-xs font-semibold text-futuristic-text-secondary uppercase tracking-wider mb-2">
                {activeModule.label}
              </h3>
              {activeModule.subItems.map((subItem) => (
                <SubNavItem key={subItem.to} item={subItem} />
              ))}
            </div>
          </>
        )}
      </nav>

      <div className="mt-auto pt-6 border-t border-futuristic-primary/10">
        <p className="text-xs text-futuristic-text-secondary text-center">
          &copy; {new Date().getFullYear()} Futuristic Systems
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
