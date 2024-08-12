import { MdLocationOn } from 'react-icons/md';
import {
  AiFillGithub,
  AiFillInstagram,
  AiFillMediumSquare,
  AiOutlineClose,
} from 'react-icons/ai';
import { RiPhoneFill, RiMailFill } from 'react-icons/ri';
import { Fragment } from 'react';
import {
  FaBehanceSquare,
  FaBuilding,
  FaDev,
  FaFacebook,
  FaGlobe,
  FaSkype,
  FaMastodon,
  FaStackOverflow,
  FaTelegram,
  FaLinkedin,
  FaYoutube,
  FaTimes,
} from 'react-icons/fa';
import PropTypes from 'prop-types';
import { skeleton } from '../../helpers/utils';

const isCompanyMention = (company) => {
  return company.startsWith('@') && !company.includes(' ');
};

const companyLink = (company) => {
  return `https://github.com/${company.substring(1)}`;
};

const getFormattedMastodonValue = (mastodonValue, isLink) => {
  const [username, server] = mastodonValue.split('@');

  if (isLink) {
    return `https://${server}/@${username}`;
  } else {
    return `${username}@${server}`;
  }
};

const ListItem = ({ icon, link }) => {
  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      className="p-2"
    >
      <div className="text-2xl"> {/* Adjusted to medium size */}
        {icon}
      </div>
    </a>
  );
};

const Details = ({ profile, loading, social, github }) => {
  return (
    <div className="card shadow-lg compact bg-base-100">
      <div className="card-body">
        <div className="text-base-content text-opacity-60">
          {/* Other content remains unchanged */}

          {/* Icons Section */}
          <div className="flex justify-center space-x-4 py-4"> {/* Aligns icons in a row */}
            <ListItem
              icon={<AiFillGithub className="text-black" />} // GitHub black
              link={`https://github.com/${github.username}`}
            />
            {social?.linkedin && (
              <ListItem
                icon={<FaLinkedin className="text-blue-700" />} // LinkedIn blue
                link={`https://www.linkedin.com/company/${social.linkedin}`}
              />
            )}
            {social?.facebook && (
              <ListItem
                icon={<FaFacebook className="text-blue-600" />} // Facebook blue
                link={`https://www.facebook.com/${social.facebook}`}
              />
            )}
            {social?.instagram && (
              <ListItem
                icon={<AiFillInstagram className="text-pink-500" />} // Instagram pink
                link={`https://www.instagram.com/${social.instagram}`}
              />
            )}
            {social?.youtube && (
              <ListItem
                icon={<FaYoutube className="text-red-600" />} // YouTube red
                link={`https://www.youtube.com/@${social.youtube}`}
              />
            )}
            {social?.medium && (
              <ListItem
                icon={<AiFillMediumSquare className="text-black" />} // Medium black
                link={`https://medium.com/@${social.medium}`}
              />
            )}
            {social?.dev && (
              <ListItem
                icon={<FaDev className="text-black" />} // DEV black
                link={`https://dev.to/${social.dev}`}
              />
            )}
            {social?.stackoverflow && (
              <ListItem
                icon={<FaStackOverflow className="text-orange-600" />} // Stack Overflow orange
                link={`https://stackoverflow.com/users/${social.stackoverflow}`}
              />
            )}
            {social?.telegram && (
              <ListItem
                icon={<FaTelegram className="text-blue-400" />} // Telegram blue
                link={`https://t.me/${social.telegram}`}
              />
            )}
            {social?.skype && (
              <ListItem
                icon={<FaSkype className="text-blue-500" />} // Skype blue
                link={`skype:${social.skype}?chat`}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Details.propTypes = {
  profile: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  social: PropTypes.object.isRequired,
  github: PropTypes.object.isRequired,
};

ListItem.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.node,
  value: PropTypes.node,
  link: PropTypes.string,
  skeleton: PropTypes.bool,
};

export default Details;
