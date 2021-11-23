import React from 'react';
import { useAuth } from "../contexts/auth";
import UnsignedRoutes from "../routes/unsignedRoutes";
import SignedRoutes from "../routes/signedRoutes";

const Routes: React.FC = () => {
    const { signed } = useAuth();
    
    return signed ? <SignedRoutes /> : <UnsignedRoutes />;
}
export default Routes;