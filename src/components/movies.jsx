import React, { Component } from 'react';
import MoviesTable from './moviesTable';
import ListGroup from './common/listGroup';
import Pagination from './common/pagination';
import { getMovies } from "../services/fakeMovieService";
import { getGenres } from '../services/fakeGenreService';
import {paginate} from '../utils/paginate';
import _ from 'lodash';
import Link from 'react-router-dom/Link';

class Movies extends Component{
    state = {
        movies: [], 
        genres: [],
        currentPage:1,
        pageSize: 4,
        sortColumn:{path:'title', order: 'asc'}
    };

    componentDidMount() {
        const genres = [{_id: "", name:'All Genres'}, ...getGenres()];
        this.setState({ movies: getMovies(), genres: genres });
    }

    handleDelete = movie => {
        const movies= this.state.movies.filter(m => m._id !== movie._id);
        this.setState({ movies});
    }

    handleSort = sortColumn => {
    
        this.setState({ sortColumn });
    }

    handleLike = movie => {
        //console.log('Like Clicked', movie);
        const movies = [...this.state.movies];    
        const index = movies.indexOf(movie);
        movies[index] = {...movies[index]};
        movies[index].liked = !movies[index].liked;
        this.setState({movies});
    }

    handlePageChange = page => {
        this.setState({currentPage: page});
    }

    handleGenreSelect = genre => {
        this.setState({ selectedGenre: genre ,searchQuery:'', currentPage: 1});
    }

    handleSearch = query =>{
        this.setState({searchQuery: query, selectedGenre: null, currentPage});
    }

    getPagedData =() => {
        const { 
            pageSize, 
            currentPage, 
            sortColumn,
            selectedGenre, 
            movies:allMovies 
        } = this.state;

        const filtered = selectedGenre && selectedGenre._id
            ? allMovies.filter(m => m.genre._id === selectedGenre._id)
            : allMovies;
        
        const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

        const movies = paginate(sorted, currentPage, pageSize);

        return {totalCount:filtered.length, data: movies}
    }

    render() {
        const { length: count } = this.state.movies;
        const { 
            pageSize, 
            currentPage, 
            sortColumn,
            selectedGenre
            
        } = this.state;

        if (count === 0) return <p>There are no movies in the database.</p>;
        
        const { totalCount, data: movies} = this.getPagedData();
            
        return (
            <div className='row'>
                <div className='col-3'>
                    <ListGroup 
                        items={this.state.genres}                        
                        selectedItem={selectedGenre}
                        onItemSelect={this.handleGenreSelect}
                    />
                </div>
                <div className='col'>
                    <Link
                        to='/Movies/new'
                        className='btn btn-primary'
                        style={{ marginBotton:20 }}
                    >
                        New Movie
                    </Link>


                <p>Showing {totalCount} movies in the database.</p>
                <searchBox value={searchQuery} onPageChange={} />

                <MoviesTable
                    movies = {movies}
                    sortColumn = {sortColumn}
                    onLike={this.handleLike}
                    onDelete={this.handleDelete}
                    onSort={this.handleSort}
                />
                <Pagination 
                    itemsCount={totalCount} 
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={this.handlePageChange}
                />
                </div>
                
            </div>
        )      
    }
}

export default Movies;