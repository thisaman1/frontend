
import React from 'react';
import { useParams } from 'react-router-dom';

const Channel = () => {
  const { channelId } = useParams();

  return (
    <div className="container mx-auto p-4 mt-16">
      <h1 className="text-2xl font-bold mb-4">Channel {channelId}</h1>
      <p className="text-gray-600">This page is under construction</p>
    </div>
  );
};

export default Channel;
