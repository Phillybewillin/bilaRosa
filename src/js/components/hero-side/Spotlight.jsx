import { useRef, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Button from "../button/Button";
import './spotlight.scss';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination, Mousewheel, FreeMode } from "swiper/modules";
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import 'swiper/scss/autoplay';
import '../../pages/home.scss';

const Spotlight = () => {

    const [slidesPerView, setSlidesPerView] = useState(4); // Default for desktop
    const sliderRef = useRef(null);
    const navigationPrevRef = useRef(null);
    const navigationNextRef = useRef(null);
    const touchStartTimeRef = useRef(null);
    const touchStartXRef = useRef(null);
    const navigate = useNavigate();

    const ACTIVE_WIDTH = 800;    // Active slide width when fully active.
    const INACTIVE_WIDTH = 300;  // All other slides width.
    const WIDTH_DIFF = ACTIVE_WIDTH - INACTIVE_WIDTH; // 500 px.
    const MAX_DURATION = 500;    // Duration (ms) for a full transition (t=1).
    const COMMIT_THRESHOLD = 0.5; // If computed factor ≥ 0.5, commit to the neighbor.
    const TRANSITION_SPEED = 1000; // ms for a slow, gradual transition.

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSlidesPerView(4); // Desktop
            } else if (window.innerWidth >= 768) {
                setSlidesPerView(2); // Tablet
            } else {
                setSlidesPerView(1); // Mobile
            }
        };

        // Set initial slides per view
        handleResize();

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleEpisodeClick = (id, title, selectedSeason, episodeNumber) => {
        if (title && id && selectedSeason && episodeNumber) {
            const encodedTitle = encodeURIComponent(title.replace(/ /g, '-').toLowerCase());
            navigate(`/watch/${encodedTitle}/${id}/${selectedSeason}/${episodeNumber}`);
        }
    };

    const handlePlayer = (itemId, itemName) => {
        if (itemName && itemId) {
            const encodedTitle = encodeURIComponent(itemName.replace(/ /g, '-').toLowerCase());
            navigate(`/watch/${encodedTitle}/${itemId}`);
        }
    };

    // Parallax effect using Swiper's onProgress
    const handleSwiperProgress = (swiper) => {
        for (let i = 0; i < swiper.slides.length; i++) {
            const slide = swiper.slides[i];
            const slideProgress = swiper.slides[i].progress; // -1 for previous, 0 for current, 1 for next
            const innerImage = slide.querySelector('.spotlight-image'); // Get the image element
            if (innerImage) {
                // Adjust this multiplier for more or less parallax effect
                const parallaxOffset = slideProgress * 150; // Example: 150px parallax effect
                innerImage.style.transform = `translate3d(${parallaxOffset}px, 0, 0)`;
            }
        }
    };

    // Custom touchmove handlers
    const customOnTouchStart = (swiper, event) => {
        if (slidesPerView !== 4) return; // Only apply custom width logic on desktop
        touchStartTimeRef.current = Date.now();
        touchStartXRef.current = swiper.touches.startX;

        // Reset widths for all slides when touch starts to prevent issues from previous incomplete transitions
        swiper.slides.forEach((slide, idx) => {
            if (idx === swiper.activeIndex) {
                slide.style.width = `${ACTIVE_WIDTH}px`;
            } else {
                slide.style.width = `${INACTIVE_WIDTH}px`;
            }
            slide.style.transitionDuration = '0ms'; // Remove transition during manual drag
        });
    };

    const customOnTouchMove = (swiper, event) => {
        if (slidesPerView !== 4) return; // Only apply custom width logic on desktop
        const currentTime = Date.now();
        const duration = currentTime - touchStartTimeRef.current;
        let t = duration / MAX_DURATION;
        if (t > 1) t = 1;

        const deltaX = swiper.touches.currentX - touchStartXRef.current;
        const swipeDirection = deltaX < 0 ? 'next' : 'prev';

        const activeIndex = swiper.realIndex; // Use realIndex for loop mode
        const activeSlide = swiper.slides[swiper.activeIndex]; // Use activeIndex for direct DOM access
        if (!activeSlide) return;

        let neighborSlide = null;

        if (swipeDirection === 'next') {
            if (swiper.slides[swiper.activeIndex + 1]) { // Check based on visual position
                neighborSlide = swiper.slides[swiper.activeIndex + 1];
            }
        } else if (swipeDirection === 'prev') {
            if (swiper.slides[swiper.activeIndex - 1]) { // Check based on visual position
                neighborSlide = swiper.slides[swiper.activeIndex - 1];
            }
        }

        // Clamp t based on deltaX to avoid negative width calculations if moving wrong direction
        if ((swipeDirection === 'next' && deltaX > 0) || (swipeDirection === 'prev' && deltaX < 0)) {
             t = 0; // If swiping in the "wrong" direction, don't change widths
        }

        const newActiveWidth = ACTIVE_WIDTH - WIDTH_DIFF * t;
        activeSlide.style.width = `${Math.max(INACTIVE_WIDTH, newActiveWidth)}px`; // Ensure min width

        if (neighborSlide) {
            const newNeighborWidth = INACTIVE_WIDTH + WIDTH_DIFF * t;
            neighborSlide.style.width = `${Math.min(ACTIVE_WIDTH, newNeighborWidth)}px`; // Ensure max width
        }

        // Ensure all other slides are set to the inactive width.
        swiper.slides.forEach((slide, idx) => {
            if (slide !== activeSlide && slide !== neighborSlide) {
                slide.style.width = `${INACTIVE_WIDTH}px`;
            }
        });
    };

    const customOnTouchEnd = (swiper, event) => {
        if (slidesPerView !== 4) {
            // On non-desktop, reset widths to default swiper behavior
            swiper.slides.forEach(slide => {
                slide.style.width = ''; // Remove inline width to let CSS/Swiper handle it
                slide.style.transitionDuration = ''; // Remove inline transition
            });
            return;
        }

        const currentTime = Date.now();
        const duration = currentTime - touchStartTimeRef.current;
        let t = duration / MAX_DURATION;
        if (t > 1) t = 1;

        const activeIndex = swiper.realIndex; // Use realIndex for logical slide position
        const deltaX = swiper.touches.currentX - touchStartXRef.current;
        const swipeDirection = deltaX < 0 ? 'next' : 'prev';

        // Apply transition duration for smooth snap back/to
        swiper.slides.forEach(slide => {
            slide.style.transitionDuration = `${TRANSITION_SPEED}ms`;
        });

        // Determine if we should commit to the next/prev slide or return to active
        if (Math.abs(deltaX) > swiper.width * 0.1 && t >= COMMIT_THRESHOLD) { // Added deltaX check for sufficient swipe
            if (swipeDirection === 'next') {
                swiper.slideNext(TRANSITION_SPEED);
            } else {
                swiper.slidePrev(TRANSITION_SPEED);
            }
        } else {
            // Revert to current active state with transition
            swiper.slideTo(swiper.activeIndex, TRANSITION_SPEED);
            // Manually ensure widths snap back if not handled by slideTo
            setTimeout(() => {
                 swiper.slides.forEach((slide, idx) => {
                    if (idx === swiper.activeIndex) {
                        slide.style.width = `${ACTIVE_WIDTH}px`;
                    } else {
                        slide.style.width = `${INACTIVE_WIDTH}px`;
                    }
                });
            }, TRANSITION_SPEED / 2); // Half way through transition
        }
        touchStartTimeRef.current = null; // Clear touch start time after touch ends
        touchStartXRef.current = null; // Clear touch start X after touch ends
    };

    const handleSetTransition = (swiper, speed) => {
        if (slidesPerView !== 4) {
            // On non-desktop, allow Swiper's default transition
            swiper.slides.forEach((slide) => {
                slide.style.transitionDuration = ''; // Remove inline to let Swiper/CSS handle it
            });
            return;
        }

        // Only apply transition duration if not in a custom touch move scenario
        if (!touchStartTimeRef.current) {
            swiper.slides.forEach((slide) => {
                slide.style.transitionDuration = `${speed}ms`;
            });
        }
    };

    // Data for slides (refactored for cleaner code)
    const slidesData = [
          {
            id: 870028, type: 'movie', title: 'the accountant 2', number: 'R',
            image: 'https://image.tmdb.org/t/p/original/abznrQ6EAxV7vZglaS5umsrTNOS.jpg',
            logo: 'https://image.tmdb.org/t/p/original/dNZAN3YNlOT23tIaWlB6EBHVYG7.png',
            genres: ['ACTION', 'CRIME', 'THRILLER'], release: 'MOVIE | 18 APR 2025', rating: '71%',
            overview: 'Do you like puzzles?',
            dropShadow: 'drop-shadow(0 0 3rem rgba(137, 105, 77, 0.39))'
        },
        {
            id: 1233413, type: 'movie', title: 'sinners', number: 'R',
            image: 'https://image.tmdb.org/t/p/original/nAxGnGHOsfzufThz20zgmRwKur3.jpg',
            logo: 'https://image.tmdb.org/t/p/w500/neDI3TKo5Pe3hBxas3SHAM83T2e.png',
            genres: ['HORROR', 'MYSTERY', 'THRILLER'], release: 'MOVIE | 18 APR 2025', rating: '74%',
            overview: 'Trying to leave their troubled lives behind, twin brothers return to their hometown to start again, only to discover that an even',
            dropShadow: 'drop-shadow(0 0 3rem rgba(198, 23, 7, 0.39))'
        },
        {
            id: 60625, type: 'tv', title: 'Rick and Morty ', number: 'TV-14',
            image: 'https://image.tmdb.org/t/p/original/mgcgx7LVsB9ko2wvbj6yQeyrrzr.jpg',
            logo: 'https://image.tmdb.org/t/p/w500/yX4zH78qqpIfBKvsxccy33bEZGO.png',
            genres: ['ANIMATION', 'COMEDY', 'SCI-FI & FANTASY'], release: 'TV | 04 DEC 2013', rating: '86%',
            overview: 'The twosome you have been waiting for', selectedSeason: 1, episodeNumber: 1,
            dropShadow: 'drop-shadow(0 0 3rem rgba(143, 142, 141, 0.27)'
        },
        {
            id: 247718, type: 'tv', title: 'Mobland', number: 'TV-MA',
            image: 'https://image.tmdb.org/t/p/original/hIhpno9yQiGjpuguRLuA1Zd2d7O.jpg',
            logo: 'https://image.tmdb.org/t/p/w500/a9YLMuK3MoQr1Au5SJPVp4dMn3o.png',
            genres: ['ACTION', 'MYSTERY', 'THRILLER'], release: 'SHOW | 23 MAY 2025', rating: '86%',
            overview: 'Two mob families clash in a war that threatens to topple empires and lives.',selectedSeason: 1, episodeNumber: 1,
            dropShadow: 'drop-shadow(0 0 3rem rgba(13, 19, 57, 0.29))'
        },
        {
            id: 1098006, type: 'movie', title: 'fountain of youth', number: '12',
            image: 'https://image.tmdb.org/t/p/original/esKev4tSgF30FDTTZ30594IPOFL.jpg',
            logo: 'https://image.tmdb.org/t/p/original/bRPUuZDldnWKlJiqkgG1rpk4fpr.png',
            genres: ['COMEDY', 'MYSTERY', 'THRILLER'], release: 'MOVIE | 23 MAY 2025', rating: '71%',
            overview: 'A treasure-hunting mastermind assembles a team for a life-changing adventure. But to outwit and outrun threats at every turn,',
            
            dropShadow: 'drop-shadow(0 0 3rem rgba(222, 183, 118, 0.29))'
        },
        {
            id: 1232546, type: 'movie', title: 'until dawn', number: 'R',
            image: 'https://image.tmdb.org/t/p/original/mGZ5rJhtomz6MmfwOy6cm0NPm5Y.jpg',
            logo: 'https://image.tmdb.org/t/p/w500/3IiL0AWDbVsrog76Kq0ma8KFnAW.png',
            genres: ['HORROR', 'MYSTERY', 'THRILLER'], release: 'MOVIE | 25 APR 2025', rating: '63%',
            overview: 'One year after her sister Melanie mysteriously disappeared, Clover and her friends head into the remote valley where she vanished in search of answers. Exploring an abandoned visitor center, they find themselves stalked by a masked killer and',
            dropShadow: 'drop-shadow(0 0 3rem rgba(83, 87, 92, 0.59))'
        },
        {
            id: 86831, type: 'tv', title: 'Ldr', number: 'TV-MA',
            image: 'https://image.tmdb.org/t/p/original/kph2s6CJ6ZMHYoEFa0ADLX1nYDe.jpg',
            logo: 'https://image.tmdb.org/t/p/original/QRyBVJUv9WY6u14scmG4ZD8VVG.png',
            genres: ['ANIMATION', 'DRAMA', 'SCI-FI & FANTASY'], release: 'TV | 04 DEC 2023', rating: '82%',
            overview: 'The threesome you have been waiting for', selectedSeason: 1, episodeNumber: 1,
            dropShadow: 'drop-shadow(0 0 3rem rgba(166, 169, 165, 0.269)'
        },
        {
            id: 950387, type: 'movie', title: 'a minecraft movie', number: 'PG-13',
            image: 'https://image.tmdb.org/t/p/original/2Nti3gYAX513wvhp8IiLL6ZDyOm.jpg',
            logo: 'https://image.tmdb.org/t/p/w500/5gFN6sNEuzTwx2BY2BrN795JwZl.png',
            genres: ['FAMILY', 'COMEDY', 'ADVENTURE', 'FANTASY'], release: 'MOVIE | 04 APR 2025', rating: '63%',
            overview: 'Four misfits find themselves struggling with ordinary problems when they are suddenly pulled through a mysterious portal into the Overworld: a bizarre, cubic wonderland that thrives on imagination. To get back home, they\'ll have to master this world red.',
            dropShadow: 'drop-shadow(0 0 1.5rem rgba(107, 160, 178, 0.49))'
        },
        {
            id: 247767, type: 'tv', title: 'THE STUDIO', number: 'TV-MA',
            image: 'https://image.tmdb.org/t/p/original/c1M3AWnwaVaVXDj7vPDbuu4uHap.jpg',
            logo: 'https://image.tmdb.org/t/p/w500/tU6BED5yRnEkaesZwpIBODNAGJ9.png',
            genres: ['COMEDY', 'DRAMA'], release: 'TV | 03 APR 2025', rating: '74%',
            overview: 'When a mysterious villain threatens to open the gates of Hell, a devilishly handsome demon hunter could be the world\'s best hope for salvation.', selectedSeason: 1, episodeNumber: 1,
            dropShadow: 'drop-shadow(0 0 3rem rgba(207, 220, 209, 0.2))'
        },
        {
            id: 241554, type: 'tv', title: 'murder bot', number: 'TV-MA',
            image: 'https://image.tmdb.org/t/p/original/nn9vM29SKN227zupaOOmaJz5SA0.jpg',
            logo: 'https://image.tmdb.org/t/p/w500/5wBrB7sD8k4LrexaHy89nL2Fcnh.png',
            genres: ['COMEDY', 'SCI-FI & FANTASY'], release: 'TV | 05 MAY 2025', rating: '72%',
            overview: 'In a high-tech future, a rogue security robot secretly gains free will. To stay hidden, it reluctantly joins a new mission protecting scientists on a dangerous planet...even though it just wants to binge soap operas.', selectedSeason: 1, episodeNumber: 1,
            dropShadow: 'drop-shadow(0 0 3rem rgba(77, 77, 77, 0.49))'
        },
        {
            id: 1241436, type: 'movie', title: 'WARFARE', number: 'R',
            image: 'https://image.tmdb.org/t/p/original/cJvUJEEQ86LSjl4gFLkYpdCJC96.jpg',
            logo: 'http://image.tmdb.org/t/p/w500/eTWOGyx6CbsR4ItUFssyCqAx9ej.png',
            genres: ['ACTION', 'WAR'], release: 'MOVIE | 11 APR 2025', rating: '71%',
            overview: 'A platoon of Navy SEALs embarks on a dangerous mission in Ramadi, Iraq, with the chaos and brotherhood of war retold through their memories of the event.',
            dropShadow: 'drop-shadow(0rem 1rem 2rem rgba(70, 49, 0, 0.566))'
        },
        {
            id: 83867, type: 'tv', title: 'ANDOR', number: 'TV-MA',
            image: 'https://image.tmdb.org/t/p/original/3hPKf2eriMi6B2L5brfQH0A7MNe.jpg',
            logo: 'https://image.tmdb.org/t/p/w500/xwuSAZHLsalFcOut36SDvBPDhZO.png',
            genres: ['ACTION', 'DRAMA', 'SCI-FI & FANTASY'], release: 'TV | 04 DEC 2023', rating: '83%',
            overview: 'In an era filled with danger, deception and intrigue, Cassian Andor will discover the difference he can make in the struggle against the tyrannical Galactic Empire...', selectedSeason: 1, episodeNumber: 1,
            dropShadow: 'drop-shadow(0 0 3rem rgba(77, 77, 77, 0.59))'
        },
    ];

    return (
        <>
            <div className="spotlight">
                <div className="modalhome">
                    <h1 className="homenama">HOME</h1>
                </div>
                <Swiper
                    ref={sliderRef}
                    spaceBetween={slidesPerView === 4 ? 4 : 20}
                    slidesPerView={slidesPerView}
                    initialSlide={0}
                    navigation={{
                        prevEl: navigationPrevRef.current,
                        nextEl: navigationNextRef.current,
                    }}
                    onSwiper={(swiper) => {
                        setTimeout(() => {
                            swiper.params.navigation.prevEl = navigationPrevRef.current;
                            swiper.params.navigation.nextEl = navigationNextRef.current;
                            swiper.navigation.destroy();
                            swiper.navigation.init();
                            swiper.navigation.update();
                        }, 0);
                    }}
                    loop={true}
                    slideToClickedSlide={true}
                    speed={TRANSITION_SPEED}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 4500, disableOnInteraction: false }}
                    modules={[Navigation, Autoplay, Pagination, Mousewheel, FreeMode]}
                    mousewheel={{ forceToAxis: true, sensitivity: 0.5, releaseOnEdges: true }}
                    freeMode={false}
                    onProgress={handleSwiperProgress}
                    // Apply custom touch handlers conditionally
                    onTouchStart={customOnTouchStart}
                    onTouchMove={customOnTouchMove}
                    onTouchEnd={customOnTouchEnd}
                    onSetTransition={handleSetTransition}
                    className="swiper"
                >
                    {slidesData.map((item, index) => (
                        <SwiperSlide key={index}>
                            <div className="spotlight-item">
                                <h1 className="spotlight-number">{item.number}</h1>
                                <img
                                    loading="lazy"
                                    src={item.image}
                                    alt={item.title}
                                    className="spotlight-image"
                                    style={{ filter: item.dropShadow }}
                                />
                                <div className="spotlight-content">
                                    <h2 className="spotlight-name">
                                        <img
                                            loading="lazy"
                                            className="spotim"
                                            src={item.logo}
                                            alt={`${item.title} logo`}
                                        />
                                    </h2>
                                    <div className="spotty">
                                        <p className="spotlight-genres">
                                            {item.genres.map((genre, idx) => (
                                                <span key={idx} className="genre a">{genre}</span>
                                            ))}
                                        </p>
                                        <h5 className="genre a">{item.release}</h5>
                                        <h5 className="genre a">{item.rating}</h5>
                                    </div>
                                    <p className="spotlight-overview">
                                        {item.overview}
                                    </p>
                                    <div className="spotty">
                                        <Button className="spotlight-watch-btn" onClick={() => navigate(`/${item.type}/${item.id}`)}>
                                            <i className="bx bx-info-circle"></i>
                                        </Button>
                                        {item.type === 'movie' ? (
                                            <Button className="spotlight-watch-btn" onClick={() => handlePlayer(item.id, item.title)}>
                                                <i className='bx bx-play'></i> Watch Now
                                            </Button>
                                        ) : (
                                            <Button className="spotlight-watch-btn" onClick={() => handleEpisodeClick(item.id, item.title, item.selectedSeason, item.episodeNumber)}>
                                                <i className="bx bx-play"></i> Watch Now
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}

                    <div className="alignerbutts2">
                        <div className="buttsr" ref={navigationPrevRef} > <i className="bx bx-left-arrow-alt"></i></div>
                        <div className="buttsl" ref={navigationNextRef} > <i className="bx bx-right-arrow-alt"></i></div>
                    </div>
                </Swiper>
            </div>
        </>
    );
};

export default Spotlight;
