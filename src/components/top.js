import React from 'react';
import {withTranslation} from 'react-i18next';
import {Navbar, NavbarBrand, Button} from 'reactstrap';
import {useAuth} from '../context/auth-context';
import i18n from '../utils/i18n';
import russian from '../image/russian.png';
import usa from '../image/usa.png';

const Top = (props) => {
  const auth = useAuth();
  const sendLogout = () => {
    auth.logout();
  };

  const LogoutButton = () => {
    return auth.isLog() ?
        (<Button onClick={sendLogout} href={'/'} className="ml-1">
              {props.t('dashboard-logout')}</Button>
        ) :
        null;
  };
  const changeLanguage = async (lng) => {
    await i18n.changeLanguage(lng);
  };

  const LangButton = (props) => {
    return (
        <Button onClick={() => changeLanguage(props.lang)} color="link"
                className="p-0 mr-2">
          <img src={props.image} alt={props.lang}/>
        </Button>
    );
  };

  const LanguageFlags = () => {
    return (
        <div className="media">
          <LangButton lang="ru" image={russian}/>
          <LangButton lang="en" image={usa}/>
        </div>
    );
  };

  return (
      <Navbar className="navbar-light bg-light mb-5">
        <NavbarBrand href="/">Richland</NavbarBrand>
        <div className="navbar p-0">
          <LanguageFlags/>
          <LogoutButton/>
        </div>
      </Navbar>
  );
};

export default withTranslation('Web')(Top);
