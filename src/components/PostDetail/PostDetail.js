import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import classes from './PostDetail.module.css';
import { Avatar } from '@material-ui/core';
import { BsDownload } from 'react-icons/bs';
import { FaRegShareSquare } from 'react-icons/fa';
import { AiOutlineStar, AiFillStar } from 'react-icons/ai';
import API from '../../fakeAPI';
import FollowButton from './FollowButton/FollowButton';
import FollowingButton from './FollowingButton/FollowingButton';
import CameraMetadata from './CameraMetadata/CameraMetadata';
import AddToGalleryModal from './AddToGalleryModal/AddToGalleryModal';
import AddToAlbumModal from './AddToAlbumModal/AddToAlbumModal';
import Zoom from 'react-medium-image-zoom';
import TagItem from './TagItem/TagItem';
import AlbumItem from './AlbumItem/AlbumItem';
import { useDispatch } from 'react-redux';
import { usersActions } from '../../storev2/users-slice';
import PhotoDescription from './PhotoDescription/PhotoDescription';
import Comments from './Comments/Comments';
import GalleryItem from './GalleryItem/GalleryItem';
import ShareModal from '../UI/ShareModal/ShareModal';
import { useHistory } from "react-router-dom";

/**
 * Displays the details of a photo (img, comments, faves, metadata, owner)
 * @async
 * @param {number} postId - The id of the photo/post, takes it from the url
 * @example <PostDetail />
 * 
 */
const PostDetail = (props) => {

    const currentUserId = useSelector(state => state.users.currentUser.userId);
    const currentUserToken = useSelector(state => state.users.currentUser.token);
    const dispatch = useDispatch();
    const history = useHistory();


    const postId = props.match.params.id;
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [followingMenuOpen, setFollowingMenuOpen] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [friendChecked, setFriendChecked] = useState(false);
    const [familyChecked, setFamilyChecked] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isOpenGalleryModal, setIsOpenGalleryModal] = useState(false);
    const [isOpenAlbumModal, setIsOpenAlbumModal] = useState(false);
    const [tags, setTags] = useState([]);
    const [showAddTag, setShowAddTag] = useState(false);
    const [addTagValue, setAddTagValue] = useState(null);
    const [albums, setAlbums] = useState([]);
    const [galleries, setGalleries] = useState([]);
    const [isFaved, setIsFaved] = useState();
    const [favedPhotos, setFavedPhotos] = useState([]);
    const [imgSrc, setImgSrc] = useState('');
    const [isShareModalOpen, setIsShareModalOpen] = useState(false); //redundant
    const [photo, setPhoto] = useState(null);
    const [ownerId, setOwnerId] = useState(null);
    const [fetchedPostId, setFetchedPostId] = useState(false);
    const rerender = useSelector(state => state.users.toggle); //when a new comment is added, rerender
    const tmpToken = currentUserToken;//"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYjY1ODg0MWQ1OTNjNjVjOGMxYTc5OCIsImlhdCI6MTYyMjU3NjgyMywiZXhwIjoxNjMwMzUyODIzfQ.8mCry7WtW7Z7OkhKTF13UWO_H_SDt2VAF49ucCwyDpk";

    
    const tmpPhotoId = postId; //"60b6614e1d593c65c8c1a79e";
    const tmpUserId = currentUserId; //"60b658841d593c65c8c1a798";


    useEffect(() => {

        API.get(`photo/${postId}`)
            .then(res => {
                
                setPhoto(res.data.data);
                setTags(res.data.data.tags);
                //console.log("PHOTO")
                //console.log(res);
                //console.log("OWNER ID");
                setOwnerId(res.data.data.userId._id);
                setFetchedPostId(prev => !prev);
            }).catch(err => {
                //console.log("[PostDetail]::RealName");
                //console.log(err.response);
            });

        API.get(`photo/${tmpPhotoId}`)
            .then(res => {
                //console.log("Photo details")
                //console.log(res);
                //console.log(res.data.data.userId);
                setImgSrc(res.data.data.sizes.size.large.source);
            }).catch(err => {
                //console.log("[PostDetail]::ERROR");
                //console.log(err.response);
            })

        API.get(`user/${tmpUserId}/faves`)
            .then(res => {
                //console.log("FAVED");
                if (res.data.status === 'success') {
                    dispatch(usersActions.setFavedPhotos(res.data.data.favourites));
                    setFavedPhotos(res.data.data.favourites);

                    for (let i = 0; i < favedPhotos.length; i++) {
                        if (favedPhotos[i].userId._id === tmpUserId) {
                            setIsFaved(true);
                            //dispatch(usersActions.toggleComments());
                            //window.location.reload(true);
                            break;
                        }
                    }
                }
                //console.log(res)
                
            }).catch(err => {
                //console.log(err.response);
            });

    }, [postId, rerender]);

    useEffect(() => {
        API.get(`user/${ownerId}/real-name`)
            .then(res => {
                setFirstName(res.data.data.firstName);
                setLastName(res.data.data.lastName);
            }).catch(err => {
                //console.log("[PostDetail]::RealName");
                //console.log(err.response);
            });
    }, [fetchedPostId]);

    useEffect(() => {
        //TODO: should be changed to ${currentUserId}
        API.get(`users/400/albums`)
            .then(res => {
                setAlbums(res.data);
                
            }).catch(err => {
                //console.log(err);
            });

        API.get(`users/400/galleries`)
        .then(res => {
            setGalleries(res.data);
            //console.log(res.data);
            
        }).catch(err => {
            //console.log(err);
        });
        
        API.get(`user/${tmpUserId}/faves`)
            .then(res => {
                //console.log("FAVED");
                if (res.data.status === 'success') {
                    dispatch(usersActions.setFavedPhotos(res.data.data.favourites));
                    setFavedPhotos(res.data.data.favourites);
                }
                //console.log(res)
                
            }).catch(err => {
                //console.log(err.response);
            });

        for (let i = 0; i < favedPhotos.length; i++) {
            if (favedPhotos[i].userId._id === tmpUserId) {
                setIsFaved(true);
                dispatch(usersActions.toggleComments());
                //window.location.reload(true);
                break;
            }
        }

    }, [currentUserId])


    const handleFav = () => {
        
        if (isFaved) {
            API.delete(`user/faves/${postId}`, { 
                headers: {
                    "Authorization": `Bearer ${tmpToken}` 
                }})
                .then(res => {
                    //console.log("REMOVING A FAVE");
                    //console.log(res);
                    
                }).catch(err => {

                });
                setIsFaved(false);
        } else {
            API.post(`user/faves/${postId}`,{},{ 
                headers: {
                "Authorization": `Bearer ${tmpToken}` 
                }})
                .then(res => {
                    //console.log("ADDING A FAV");
                    //console.log(res);
                    setIsFaved(true);
                }).catch(err => {
                    //console.log(err.response);
                });
                setIsFaved(true);
        }

        //setIsFaved(prevFav => !prevFav);
        //window.location.reload(true);
    }

    const handleOpenFollowing = (event) => {
        setFollowingMenuOpen(true);
        setAnchorEl(event.currentTarget);
    }

    const handleCloseFollowingPopover = () => {
        setFollowingMenuOpen(false);
        setAnchorEl(null);
    }

    const handleFriendCheckboxChange = (event) => {
        setFriendChecked(event.target.checked);
    }

    const handleFamilyCheckboxChange = (event) => {
        setFamilyChecked(event.target.checked);
    }

    const handleFollowClick = (event) => {
        setIsFollowing(true);
        API.patch(`photos/${postId}`, {
            isFollowing: true
        }).then(res => {

        });
    }

    const handleUnFollow = (event) => {
        setIsFollowing(false);
        API.patch(`photos/${postId}`, {
            isFollowing: false
        }).then(res => {
            
        });
            
    }

    const handleOpenGalleryModal = () => {
        setIsOpenGalleryModal(true);
    }

    const handleCloseGalleryModal = () => {
        setIsOpenGalleryModal(false);
    }

    const handleOpenAlbumModal = () => {
        setIsOpenAlbumModal(true);
    }

    const handleCloseAlbumModal = () => {
        setIsOpenAlbumModal(false);
    }

    const handleShowAddTag = () => {
        setShowAddTag(true);
    }

    const handleAddTagChange = (event) => {
        setAddTagValue(event.target.value);
    }

    const handleAddTagKeyDown = (event) => {
        if (event.key === 'Enter') {
            setTags(prevTags => [...prevTags, addTagValue]);
            //setShowAddTag(false);
            API.post(`photo/${postId}/tags`, {
                tags: addTagValue
            },
            { 
                headers: {
                "Authorization": `Bearer ${tmpToken}` 
            }}).then(res => {
                console.log("TAGS");
                console.log(res);
            }).catch(err => {

            });

            setAddTagValue('');
        }
    }

    const handleDeleteFromAlbum = (albumId) => {
        //alert("deleting albumId: "+albumId);
        API.delete(`/albums/${+albumId}`)
            .then(res => {
                dispatch(usersActions.deleteFromAlbumToggle());
            }).catch(err => {
                console.log(err)
            })
    }

    const handleDeleteFromGallery = (galleryId) => {
        //alert("deleting albumId: "+albumId);
        API.delete(`/galleries/${+galleryId}`)
            .then(res => {
                dispatch(usersActions.deleteFromAlbumToggle());
            }).catch(err => {
                console.log(err)
            })
    }

    const handleDownloadPhoto = (event) => {
        // TODO: make API request
    }

    
    // ********** Share Modal *************

    const handleOpenShareModal = (event) => {
        console.log("Share clicked");
        setIsShareModalOpen(true);
    }

    const handleCloseShareModal = () => {
        setIsShareModalOpen(false);
    }

    const handleGoToHome = () => {
        history.push("/home");
    }

    const handleGoToProfile = () => {
        history.push(`/user/${ownerId}`);
    }


    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <Fragment>
            <div className={classes.image__view}>
                <div className={classes.back} onClick={handleGoToHome}>
                    ← Back to home
                </div>
                <Zoom
                    image={{
                    //src: `${post.imageUrl}`,
                    src: `${imgSrc}`,
                    alt: 'photo detail',
                    className: `${classes.image__view_img}`,
          
                    }}
                    zoomImage={{
                    src: `${imgSrc}`,
                    alt: 'photo detail large'
                    }}
                />
                {/* <img className={classes.image__view_img} src={post.imageUrl} alt="" /> */}
                {isFaved ? <AiFillStar id="photo-like-filled-btn" onClick={handleFav} className={`${classes.buttons} ${classes.image__view_fav}`} style={{color: 'white'}}/> : <AiOutlineStar id="photo-like-unfilled-btn" onClick={handleFav} className={`${classes.buttons} ${classes.image__view_fav}`} style={{color: 'white'}} data-testid="faved-btn"/>}
                <FaRegShareSquare onClick={() => setIsShareModalOpen(true)} className={`${classes.buttons} ${classes.image__view_share}`} style={{color: 'white'}} data-testid="share-btn"/>
                <BsDownload onClick={handleDownloadPhoto} className={`${classes.buttons} ${classes.image__view_download}`} style={{color: 'white'}} data-testid="download-btn" />
                <ShareModal 
                    isShareModalOpen={isShareModalOpen} 
                    handleCloseShareModal={handleCloseShareModal}
                    modalTitle="Share the photo"
                    externalShareLink={imgSrc}
                />

            </div>


            <div className={classes.main__content}>
            <div className={classes.sub__photo__container}>
                <div className={classes.sub__photo__content__container}>
                    <div className={classes.sub__photo__left__view}>
                        <div className={classes.user__header}>
                            <div style={{marginRight: '20px'}}>
                                <Avatar src="" />
                            </div>
                            <p onClick={handleGoToProfile} className={classes.real__name} >{firstName}{" "}{lastName}</p>
                            {/* <button className={classes.follow__button}>Following</button> */}
                            {(ownerId === currentUserId) ? null : isFollowing ? <FollowingButton onClickUnFollow={handleUnFollow} /> : <FollowButton onClickFollow={handleFollowClick} />}
                            
                            
                        </div>
                        <div style={{display: 'flex'}}>
                            <button className={classes.pro__button} >PRO</button>
                            <PhotoDescription token={tmpToken} postId={postId} isEditable={ownerId === currentUserId} title="Title" description="This is a description" />
                        </div>
                        <Comments token={currentUserToken} isPhotoMine={ownerId === currentUserId} userId={photo && photo.userId} photoId={postId}/>

                        <div>
                            
                        </div>
                    </div>
                    <div className={classes.sub__photo__right__view}>
                        {/* right */}
                        <div className={classes.sub__photo__right__row1}>
                            <div className={classes.sub__photo__right__stats__view}>
                                <div className={classes.right__stats_details__container}>
                                    <div className={classes.stat__item}>
                                        <span data-testid="count-views">{photo && photo.views}</span>
                                        <span className={classes.stats__label} id="photodetail-views-counts">views</span>
                                    </div>
                                    <div className={classes.stat__item}>
                                        <span data-testid="count-faves">{photo && photo.favourites}</span>
                                        <span className={classes.stats__label} id="photodetail-faves-count">faves</span>
                                    </div>
                                    <div className={classes.stat__item}>
                                        <span data-testid="count-comments">{photo && photo.comments.length}</span>
                                        <span className={classes.stats__label} id="photodetail-comments-count">comments</span>
                                    </div>
                                </div>
                                <div className={classes.date__taken}>
                                    {photo && <span>Taken on {photo.dateUploaded.slice(0, 10)}</span> }
                                </div>
                            </div>
                        </div>
                        <div className={classes.sub__photo__right__row2}>
                            <CameraMetadata photoId={postId} cameraName="Nikon" lensString="16.0-35.0 mm" focalLength="f/4.0"/>
                        </div>
            
                        <div className={classes.sub__photo__right__row3}>
                            <div className={classes.galleries}>
                                <h5 className={classes.galleries__count} data-testid="galleries-count">
                                    This photo is in {galleries.length} galleries
                                </h5>
                                <p className={classes.add__to__gallery}
                                onClick={handleOpenGalleryModal}
                                >Add to gallery</p>
                                <AddToGalleryModal openGalleryModal={isOpenGalleryModal}
                                closeGalleryModal={handleCloseGalleryModal}/>

                                <ul className={classes.albums__list}>
                                    {galleries.map(gallery => (
                                        <GalleryItem onDeleteGallery={() => handleDeleteFromGallery(gallery.id)} 
                                            key={gallery.id} galleryId={gallery.id} 
                                            photoSrc={gallery.photoSrc} 
                                            galleryTitle={gallery.title} 
                                            itemsCount={gallery.itemsCount} 
                                            isPhotoMine={ownerId === currentUserId}
                                        />
                                    ))}
                                </ul>

                            </div>
                        </div> 

                        {(ownerId === currentUserId) && (
                        <div className={classes.sub__photo__right__row5}>
                            <div className={classes.galleries}>
                                <h5 className={classes.galleries__count} data-testid="albums-count">
                                    This photo is in {albums.length} albums
                                </h5>
                                <p className={classes.add__to__gallery}
                                onClick={handleOpenAlbumModal}
                                >Add to album</p>
                                <AddToAlbumModal openGalleryModal={isOpenAlbumModal}
                                closeGalleryModal={handleCloseAlbumModal}/>

                                <ul className={classes.albums__list}>
                                    {albums.map(album => (
                                        <AlbumItem onDeleteAlbum={() => handleDeleteFromAlbum(album.id)} key={album.id} albumId={album.id} photoSrc={album.photoSrc} albumTitle={album.title} itemsCount={album.itemsCount} />
                                    ))}
                                </ul>
                            </div>
                        </div>              
                        )}
                        <div className={classes.sub__photo__right__row4}>
                            <div className={classes.tags__view}>
                                <h5 className={classes.tags__title}>Tags</h5>
                                <p onClick={handleShowAddTag} className={classes.add__tag} data-testid="add-tags">Add tags</p>
                                {showAddTag && <input data-testid="input-add-tags" onKeyDown={handleAddTagKeyDown} onChange={handleAddTagChange} value={addTagValue} type="text" placeholder="Add a tag" className={classes.add__tag__input} />}
                                <ul className={classes.tags__list}>
                                    {tags.map(tag => <TagItem tagText={tag} token={tmpToken} photoId={postId} tagName={tag} editable={true}/>)}
                                </ul>
                                
                            </div>
                        </div>   


                    </div>
                   
                </div>
            </div>
            </div>
        </Fragment>
    );
}

export default PostDetail;