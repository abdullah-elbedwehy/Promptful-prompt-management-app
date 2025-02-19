import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaInbox, FaCalendarDay, FaCalendar, FaList, FaTags, FaSearch } from 'react-icons/fa';
import styled from 'styled-components';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <Container>
            <Sidebar>
                <UserProfile>
                    <UserAvatar />
                    <span>Guest</span>
                </UserProfile>

                <Nav>
                    <NavLink to="/" $active={isActive('/')}>
                        <FaInbox />
                        Inbox
                    </NavLink>
                    <NavLink to="/today" $active={isActive('/today')}>
                        <FaCalendarDay />
                        Today
                    </NavLink>
                    <NavLink to="/upcoming" $active={isActive('/upcoming')}>
                        <FaCalendar />
                        Upcoming
                    </NavLink>
                    <Divider />
                    <NavLink to="/lists" $active={isActive('/lists')}>
                        <FaList />
                        Lists
                    </NavLink>
                    <NavLink to="/tags" $active={isActive('/tags')}>
                        <FaTags />
                        Tags
                    </NavLink>
                </Nav>
            </Sidebar>

            <MainContent>
                <SearchBar>
                    <SearchIcon>
                        <FaSearch />
                    </SearchIcon>
                    <SearchInput type="text" placeholder="Search tasks..." />
                </SearchBar>
                {children}
            </MainContent>

            <RightPanel>
                <TaskDetails>
                    <h3>Task Details</h3>
                    {/* Task details will be loaded here */}
                </TaskDetails>
            </RightPanel>
        </Container>
    );
};

const Container = styled.div`
    display: grid;
    grid-template-columns: 250px 1fr 300px;
    height: 100vh;
    background-color: var(--bg-primary);
    color: var(--text-primary);
`;

const Sidebar = styled.aside`
    background-color: var(--bg-secondary);
    border-right: 1px solid var(--border-color);
    padding: 1rem;
`;

const UserProfile = styled.div`
    display: flex;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 1rem;
`;

const UserAvatar = styled.div`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: var(--accent-color);
    margin-right: 0.75rem;
`;

const Nav = styled.nav`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`;

const NavLink = styled(Link)<{ $active: boolean }>`
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    color: ${(props) => (props.$active ? 'var(--text-primary)' : 'var(--text-secondary)')};
    text-decoration: none;
    border-radius: 6px;
    gap: 0.75rem;
    background-color: ${(props) => (props.$active ? 'var(--hover-bg)' : 'transparent')};

    &:hover {
        background-color: var(--hover-bg);
        color: var(--text-primary);
    }

    svg {
        width: 20px;
        height: 20px;
    }
`;

const Divider = styled.div`
    height: 1px;
    background-color: var(--border-color);
    margin: 1rem 0;
`;

const MainContent = styled.main`
    padding: 1rem;
    overflow-y: auto;
`;

const SearchBar = styled.div`
    display: flex;
    align-items: center;
    background-color: var(--bg-secondary);
    border-radius: 6px;
    padding: 0.5rem;
    margin-bottom: 1rem;
`;

const SearchIcon = styled.div`
    color: var(--text-secondary);
    margin: 0 0.5rem;
`;

const SearchInput = styled.input`
    background: none;
    border: none;
    color: var(--text-primary);
    width: 100%;
    padding: 0.25rem;
    outline: none;

    &::placeholder {
        color: var(--text-secondary);
    }
`;

const RightPanel = styled.aside`
    background-color: var(--bg-secondary);
    border-left: 1px solid var(--border-color);
    padding: 1rem;
`;

const TaskDetails = styled.div`
    h3 {
        margin-bottom: 1rem;
        font-size: 1.1rem;
        font-weight: 600;
    }
`;

export default Layout;
