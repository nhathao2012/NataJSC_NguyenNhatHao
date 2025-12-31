import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';

export default function Guard({ children }) {
    const token = localStorage.getItem('token');
    const location = useLocation();
    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
}
Guard.propTypes = { children: PropTypes.node };