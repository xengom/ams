import styled from "styled-components";
import { Link } from "react-router-dom";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <Container>
      <Header>
        <Nav>
          <StyledLink to="/">대시보드</StyledLink>
          <StyledLink to="/portfolio">포트폴리오</StyledLink>
        </Nav>
      </Header>
      <Main>{children}</Main>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  background-color: ${(props) => props.theme.colors.background};
`;

const Header = styled.header`
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: ${(props) => props.theme.spacing.md};
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: ${(props) => props.theme.spacing.md};
`;

const StyledLink = styled(Link)`
  color: ${(props) => props.theme.colors.primary};
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${(props) => props.theme.spacing.xl};
`;

export default MainLayout;
