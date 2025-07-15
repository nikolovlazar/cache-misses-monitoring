import type { Context } from 'hono';

// Movie data - can be moved to a database later
const MOVIES = [
  {
    id: 1,
    title: 'The Matrix',
    genre: 'Action',
    rating: 8.7,
    year: 1999,
    runtime: 136,
    director: 'Lana Wachowski, Lilly Wachowski',
    cast: [
      'Keanu Reeves',
      'Laurence Fishburne',
      'Carrie-Anne Moss',
      'Hugo Weaving',
    ],
    poster:
      'https://images.unsplash.com/photo-1691085465046-807f880ba9d7?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    backdrop:
      'https://images.unsplash.com/photo-1640388397643-cd924ab7ef1b?q=80&w=3397&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    synopsis:
      'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers. Neo discovers that reality as he knows it is actually a computer simulation called the Matrix.',
    budget: '$63 million',
    boxOffice: '$467.2 million',
    awards: ['4 Academy Awards', '7 Saturn Awards'],
    languages: ['English'],
    country: 'USA',
    studio: 'Warner Bros.',
  },
  {
    id: 2,
    title: 'Inception',
    genre: 'Sci-Fi',
    rating: 8.8,
    year: 2010,
    runtime: 148,
    director: 'Christopher Nolan',
    cast: ['Leonardo DiCaprio', 'Marion Cotillard', 'Tom Hardy', 'Ellen Page'],
    poster:
      'https://images.unsplash.com/photo-1594848421678-e2b90643f95b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    backdrop:
      'https://images.unsplash.com/photo-1653392439276-984b2a2191f0?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    synopsis:
      "A thief who enters people's dreams to steal secrets from their subconscious is given the task of planting an idea into the mind of a CEO. Dom Cobb is a skilled thief who specializes in extraction.",
    budget: '$160 million',
    boxOffice: '$836.8 million',
    awards: ['4 Academy Awards', '3 BAFTA Awards'],
    languages: ['English', 'Japanese', 'French'],
    country: 'USA, UK',
    studio: 'Warner Bros.',
  },
  {
    id: 3,
    title: 'Pulp Fiction',
    genre: 'Crime',
    rating: 8.9,
    year: 1994,
    runtime: 154,
    director: 'Quentin Tarantino',
    cast: ['John Travolta', 'Samuel L. Jackson', 'Uma Thurman', 'Bruce Willis'],
    poster:
      'https://images.unsplash.com/photo-1641549058491-8a3442385da0?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    backdrop:
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    synopsis:
      'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption. A masterpiece of nonlinear storytelling.',
    budget: '$8.5 million',
    boxOffice: '$214.2 million',
    awards: ['1 Academy Award', '1 Golden Globe', '1 BAFTA Award'],
    languages: ['English'],
    country: 'USA',
    studio: 'Miramax',
  },
  {
    id: 4,
    title: 'The Dark Knight',
    genre: 'Action',
    rating: 9.0,
    year: 2008,
    runtime: 152,
    director: 'Christopher Nolan',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Michael Caine'],
    poster:
      'https://images.unsplash.com/photo-1653395108060-e0236d7a9e58?q=80&w=1886&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    backdrop:
      'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    synopsis:
      'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    budget: '$185 million',
    boxOffice: '$1.005 billion',
    awards: ['2 Academy Awards', '1 Golden Globe', '1 BAFTA Award'],
    languages: ['English'],
    country: 'USA, UK',
    studio: 'Warner Bros.',
  },
  {
    id: 5,
    title: 'Forrest Gump',
    genre: 'Drama',
    rating: 8.8,
    year: 1994,
    runtime: 142,
    director: 'Robert Zemeckis',
    cast: ['Tom Hanks', 'Robin Wright', 'Gary Sinise', 'Sally Field'],
    poster:
      'https://images.unsplash.com/photo-1553201826-fe8a9809c12d?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    backdrop:
      'https://images.unsplash.com/photo-1663868652528-04970e627cc2?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    synopsis:
      'The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate and other historical events unfold from the perspective of an Alabama man with an IQ of 75.',
    budget: '$55 million',
    boxOffice: '$678.2 million',
    awards: ['6 Academy Awards', '3 Golden Globe Awards'],
    languages: ['English'],
    country: 'USA',
    studio: 'Paramount Pictures',
  },
  {
    id: 6,
    title: 'Interstellar',
    genre: 'Sci-Fi',
    rating: 8.6,
    year: 2014,
    runtime: 169,
    director: 'Christopher Nolan',
    cast: [
      'Matthew McConaughey',
      'Anne Hathaway',
      'Jessica Chastain',
      'Bill Irwin',
    ],
    poster:
      'https://images.unsplash.com/photo-1615363227873-b9c73fdf3e65?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    backdrop:
      'https://images.unsplash.com/photo-1732633553684-b18a43a48d3d?q=80&w=3264&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    synopsis:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival. Earth's future has been riddled by disasters, famines, and droughts.",
    budget: '$165 million',
    boxOffice: '$677.5 million',
    awards: ['1 Academy Award', '1 BAFTA Award', '1 Critics Choice Award'],
    languages: ['English'],
    country: 'USA, UK, Canada',
    studio: 'Paramount Pictures',
  },
];

export async function movieDetailsHandler(c: Context) {
  try {
    const query = c.req.query('q');

    // If no query provided, return error
    if (!query) {
      return c.json({ error: 'Search query is required' }, { status: 400 });
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Search logic - exact match only (case insensitive)
    const foundMovie = MOVIES.find(
      (movie) => movie.title.toLowerCase() === query.toLowerCase()
    );

    if (!foundMovie) {
      return c.json({ error: 'Movie not found' }, { status: 404 });
    }

    return c.json({
      success: true,
      movie: foundMovie,
    });
  } catch (error) {
    console.error('Error searching for movie:', error);
    return c.json({ error: 'Internal server error' }, { status: 500 });
  }
}
