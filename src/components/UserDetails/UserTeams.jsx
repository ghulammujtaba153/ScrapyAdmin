import React from 'react';
import { FaUsers, FaCalendarAlt } from 'react-icons/fa';

const UserTeams = ({ teams = [] }) => {
    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <FaUsers className="text-primary" /> Teams Created
                </h3>
                <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
                    {teams.length} Team{teams.length !== 1 ? 's' : ''}
                </span>
            </div>
            <div className="p-0">
                {teams.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <FaUsers className="text-4xl text-gray-200 mx-auto mb-3" />
                        <p>No teams created yet.</p>
                        <p className="text-xs text-gray-400 mt-1">This user hasn't utilized the Teams feature.</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
                        {teams.map((team) => (
                            <li key={team._id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h4 className="font-bold text-gray-800">{team.name}</h4>
                                        <p className="text-xs text-gray-500 flex items-center mt-1">
                                            <FaCalendarAlt className="mr-1" />
                                            {new Date(team.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="inline-block bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                                            {team.memberCount} Member{team.memberCount !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default UserTeams;
