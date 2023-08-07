import React from 'react';
import '../styles/Previews.css';

const termsWithImages = [
  { term: 'Hip-Hop Music', image: 'https://blog.siriusxm.com/wp-content/uploads/2021/05/Spectrum_HipHop_16x9-2.jpg?w=940' },
  { term: 'Pop Music', image: 'https://www.billboard.com/wp-content/uploads/2020/12/top100songs-2020-billboard-1500-1607463880.jpg?w=942&h=623&crop=1' },
  { term: 'Country Music', image: 'https://www.rollingstone.com/wp-content/uploads/2018/06/rs-edit-100-countryartists-c09d800e-c5d2-4261-b0fd-0055d294fa7d.jpg?w=910&h=511&crop=1' },
  { term: 'Rock Music', image: 'https://townsquare.media/site/443/files/2017/10/2018HOFSnubs.jpg?w=980&q=75' },
  { term: 'R&B Music', image: 'https://thebluesproject.co/wp-content/uploads/2023/02/Contemporary-New-RB-Artists-to-Watch-2023-770x403.png' },
  { term: 'K-pop Music', image: 'https://api.time.com/wp-content/uploads/2020/12/best-of-k-pop-2020.jpg' },
  { term: 'Latin Music', image: 'https://shop.billboard.com/cdn/shop/files/Latin_WIM_cover_HIGHRES_2048x.jpg?v=1684351300' },
  { term: 'Jazz Music', image: 'https://www.rollingstone.com/wp-content/uploads/2018/12/RS_Edit_2018_YEL_Jazz.jpg?w=1296&h=864&crop=1' },
  { term: 'Metal Rock', image: 'https://www.rollingstone.com/wp-content/uploads/2023/03/metal-songs-1.jpg?w=1581&h=1054&crop=1' },
  { term: 'Classical Music', image: 'https://www.listchallenges.com/f/lists/682ce336-1273-4bda-a321-3f54810edf5f.jpg' },
  { term: 'Anime OSTs', image: 'https://www.fortressofsolitude.co.za/wp-content/uploads/2022/11/Top-10-Best-Anime-Series-Of-All-Time-Ranked-scaled.jpeg' },
  { term: 'Punk Rock Music', image: 'https://www.rollingstone.com/wp-content/uploads/2018/06/rs-235222-rs-edit-punk-1401x788.jpg' },
  { term: 'Indie Music', image: 'https://indiebandguru.com/wp-content/uploads/2022/08/2000s-indie-rock.webp' },
  { term: 'Blues Music', image: 'https://i.pinimg.com/1200x/3d/b6/3f/3db63f625a4781ca8bb9912be86f4446.jpg' },
  { term: 'Movie OSTs', image: 'https://static1.srcdn.com/wordpress/wp-content/uploads/2023/01/screenrant-best-movies-all-time-dark-knight-my-left-foot-toy-story-lord-of-the-rings-pans-labyrinth-godfather-casablanca-psycho.jpg' },
  { term: 'Christian Music', image: 'https://www.howarddavidjohnson.com/Christ_feeding_the_5000.jpg' },
  // Add more terms and their image URLs as needed
];

const Previews = ({ setSearchTerm }) => {
  return (
    <div className='previews-container'>
      {termsWithImages.map(({ term, image }, index) => (
        <div
          key={index}
          className='term-box'
          style={{
            backgroundColor: `hsl(${(index * 50) % 360}, 80%, 70%)`, // Generate different colors for each box
          }}
          onClick={() => setSearchTerm(term)}
        >
          <img src={image} alt={term} />
          <span>{term}</span>
        </div>
      ))}
    </div>
  );
};

export default Previews;
