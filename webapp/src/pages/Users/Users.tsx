import { Header, IconVariant, NavigationBar } from '../../shared/components';
import './Users.css';

export default function Users() {
  return (
    <div className="users">
      <div className="users-wrapper">
        <Header
          navigationFigure={IconVariant.ARROW_BACK}
          navigationUrl="/"
          statusVariant="online"
        >
          edit profile
        </Header>
        <Header
          navigationFigure="https://i.pravatar.cc/1000"
          navigationUrl="/"
          statusVariant="playing"
        >
          edit profile
        </Header>
        <Header navigationFigure={IconVariant.ARROW_BACK} navigationUrl="/">
          edit profile
        </Header>
        <Header navigationFigure="https://i.pravatar.cc/1000" navigationUrl="/">
          edit profile
        </Header>
        <div className="users-nav-container">
          <NavigationBar />
        </div>
      </div>
    </div>
  );
}
