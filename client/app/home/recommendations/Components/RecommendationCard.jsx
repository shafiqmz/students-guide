import React from 'react';

const RecommendationCard = ({ key, recommendation }) => {
  return (
    <div
      className='bg-white drop-shadow-lg w-[90%] xs:w-[75%] sm:w-[45%] md:w-[30%] mt-3 sm:ml-2 lg:ml-4 rounded-lg cursor-pointer hover:opacity-70 transition-all'
      key={key}
    >
      <a
        href={`https://www.youtube.com/playlist?list=${recommendation?.id?.playlistId}`}
        target='_blank'
        className='w-full'
      >
        <img
          src={recommendation?.snippet?.thumbnails?.medium?.url}
          alt='thumbnail'
          className='object-cover rounded-lg w-full'
        />
        <p className='p-2 text-bgContrast'>
          {recommendation?.snippet?.title} {' by '}
          <span className='text-textColor font-semibold'>
            {recommendation?.snippet?.channelTitle}
          </span>
        </p>
      </a>
    </div>
  );
};

export default RecommendationCard;
