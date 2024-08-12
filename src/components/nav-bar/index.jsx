import { AiOutlineControl } from 'react-icons/ai';
import { skeleton } from '../../helpers/utils';
import PropTypes from 'prop-types';

const NavBar = ({ theme, setTheme, loading, themeConfig }) => {
  const changeTheme = (e, selectedTheme) => {
    e.preventDefault();
    document.querySelector('html').setAttribute('data-theme', selectedTheme);
    typeof window !== 'undefined' &&
      localStorage.setItem('gitprofile-theme', selectedTheme);
    setTheme(selectedTheme);
  };

  return (
    <div className="card overflow-visible shadow-lg compact bg-base-100">
      <div className="flex-row items-center space-x-4 flex pl-6 pr-2 py-4">
        <div className="flex-1">


        <img
        src={`/neurons-grey.png`}
        alt="Neurons Grey"
        style={{ width: '55px', height: '55px' }}
        className="w-32 h-32 object-cover"
      />
    
        </div>
        <div className="flex-0">
         <a href="/" className="btn btn-outline btn-sm text-xs mt-2 opacity-55"> Back </a>
        </div>
      </div>
    </div>
  );
};

NavBar.propTypes = {
  theme: PropTypes.string,
  setTheme: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  themeConfig: PropTypes.object.isRequired,
};

export default NavBar;
