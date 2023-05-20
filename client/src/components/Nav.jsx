import React from 'react';
import { Link, } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
export default class Nav extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
          
        };
      }
          

    render(){
        return(
            <div className='flex flex-col bg-[#03001C] text-cyan-300 min-h-screen font-mono'>
                <aside id="default-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
                    <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                        <ul className="space-y-2 font-medium">
                            <li>
                                <Link to="/"  className="flex items-center p-2 text-cyan-300 rounded-lg ">
                                    <FontAwesomeIcon icon="fa-regular fa-house" style={{color: "#00ddfa",}} />
                                    <span className="ml-3">Home</span>
                                </Link>
                            </li>
                            <li>
                                <FontAwesomeIcon icon="fa-solid fa-chart-simple" style={{color: "#00fbff",}} />
                                <span className="ml-3">Graphs:</span>
                                <Link to="/graph/btcusdt"  className="flex items-center p-2 text-cyan-300 rounded-lg ">
                                    <span className="ml-3">Bitcoin</span>
                                </Link>
                                <Link to="/graph/ethusdt"  className="flex items-center p-2 text-cyan-300 rounded-lg ">
                                    <span className="ml-3">Etherenum</span>
                                </Link>
                                <Link to="/graph/dogeusdt"  className="flex items-center p-2 text-cyan-300 rounded-lg ">
                                    <span className="ml-3">Dodge</span>
                                </Link>
                                <Link to="/graph/solusdt"  className="flex items-center p-2 text-cyan-300 rounded-lg ">
                                    <span className="ml-3">Solana</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/marketplace"  className="flex items-center p-2 text-cyan-300 rounded-lg ">
                                    <span className="ml-3">Marketplace</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    </aside>
            </div>
        )
    }
}