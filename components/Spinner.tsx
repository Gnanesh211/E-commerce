
import React from 'react';
import { Loader2 } from 'lucide-react';

const Spinner: React.FC = () => {
    return (
        <div className="flex justify-center items-center h-full w-full p-8">
            <Loader2 className="animate-spin text-primary" size={48} />
        </div>
    );
};

export default Spinner;
