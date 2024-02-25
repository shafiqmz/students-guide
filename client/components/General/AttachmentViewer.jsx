import React, { useEffect, useState } from 'react';
import { AiFillCloseSquare } from '@react-icons/all-files/ai/AiFillCloseSquare';
import { AiOutlineVerticalLeft } from '@react-icons/all-files/ai/AiOutlineVerticalLeft';
import { AiOutlineVerticalRight } from '@react-icons/all-files/ai/AiOutlineVerticalRight';

export const AttachmentViewer = ({ attachmentObject, index, onClose }) => {
    const [currentImage, setCurrentImage] = useState(index ? index : 0);

    const currentAttachment = attachmentObject[currentImage];

    useEffect(() => {
      const handleKeyPress = (event) => {
        switch (event.key) {
          case 'ArrowLeft':
            goToPreviousImage()
            break;
          case 'ArrowRight':
            goToNextImage()
            break;
        }
      };

      window.addEventListener('keydown', handleKeyPress);

      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    }, []);

    const goToPreviousImage = () => {
      setCurrentImage((prevImage) => (prevImage === 0 ? attachmentObject.length - 1 : prevImage - 1));
    };

    const goToNextImage = () => {
      setCurrentImage((prevImage) => (prevImage === attachmentObject.length - 1 ? 0 : prevImage + 1));
    };

    let imageUrl;
    // Check if currentAttachment is a valid Blob or File   
    if (currentAttachment instanceof Blob || currentAttachment instanceof File || currentAttachment || !Array.isArray(attachmentObject) ) {
      if (currentAttachment instanceof Blob) {
        imageUrl = URL.createObjectURL(currentAttachment);
      } else if (!Array.isArray(attachmentObject)) {
        if (attachmentObject?.url) {
          imageUrl = attachmentObject.url
        } else {
          imageUrl = URL.createObjectURL(attachmentObject)
        }
      } else {
        imageUrl = currentAttachment
      }
      
      return (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              // display: 'flex',
              // justifyContent: 'space-between',
              // alignItems: 'center',
              padding: '10px 16px',
              background: 'black',
              color: 'white',
            }}
          >
            {/* <div className='flex items-center'> */}
              {/* <img className='mr-3' height={30} width={30} src={attachmentObject?.SenderImage} /> <span className='font-weight-bold'>{attachmentObject?.SenderName}</span> */}
            {/* </div> */}
            <div className='flex justify-end'>
             
              {/* <a className='pointerCursor mr-10' target='_blank' download href={imageUrl} title="Image" onClick={onClose}><i className='fas fa-download text-white' /></a> */}
              <div className='cursor-pointer mr-2 text-white text-3xl' onClick={onClose}><AiFillCloseSquare /></div>
            </div>
          </div>
    
          {/* Content with Blurred Background */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden', 
            }}
          >
            {/* Background Image */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url("${imageUrl}")`, // Background image URL
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                filter: 'blur(10px)',
                zIndex: -1, // Behind the image
              }}
            />
            {/* Blackish Overlay */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black overlay
                zIndex: 0,
              }}
            />
            {/* {attachmentObject[currentImage]?.type.startsWith('application') ? <iframe src={attachmentObject[currentImage]} style={{  width: '75%',  height: '90%',  objectFit: 'contain',  position: 'relative', 
            
               }}/> : */}
            {/* // Allow image to be on top of the background  zIndex: 1, // Above the background */}
              <img
              src={imageUrl}
              alt="Attachment"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                position: 'relative',
                zIndex: 1,
              }}
            />
            {/* } */}
            {/* Navigation Arrows */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '0px', 
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                zIndex: 2, 
                color: 'white',
                background: '#545454',
                padding: '35px 10px',
              }}
              onClick={goToPreviousImage}
            >
              <AiOutlineVerticalRight className='text-white' />{/* Left Arrow */}
            </div>
            <div
              style={{
                position: 'absolute',
                top: '50%',
                right: '0px',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                zIndex: 2,
                color: 'white',
                background: '#545454',
                padding: '35px 10px',
              }}
              onClick={goToNextImage}
            >
              <AiOutlineVerticalLeft className='text-white' />{/* Right Arrow */}
            </div>
          </div>
    
          {/* Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 16px',
              background: 'black',
              color: 'white',
            }}
          >
            {!Array.isArray(attachmentObject) ? attachmentObject?.name : <div>{attachmentObject[currentImage].name}</div>}
            {/* <div>{formateIsoData(attachmentObject?.CreatedOn)}</div> */}
          </div>
        </div>
      );
    } else {
      // Handle invalid attachmentObject or currentImage index
      return null
    }
};
