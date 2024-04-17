import React from 'react';
import { Link } from 'react-router-dom';
import cl from '../Home/page2/page2.module.css';
import useFetch from "./hooks/useFetch.js";
const Tabs = ({ activeCategoryId, handleCategoryClick }) => {
    const { data, loading } = useFetch(
        'https://spbneformal.fun/api/categories?populate=image'
    );

    return (
        <ul className={cl.tabs_box}>
            {data?.map((cat) => (
                <li key={cat.id} className={cl.tab}>
                    <button
                        className={`${cl.tab__button} ${
                            activeCategoryId === cat.id ? cl.active : ''
                        }`}
                        onClick={() => handleCategoryClick(cat.id, cat.attributes.title)}
                        data-category={cat.id}
                    >
                        <img
                            className={cl.button__image}
                            src={`https://uploads.spbneformal.fun${cat.attributes.image.data.attributes.url}`}
                            alt=""
                        />
                        <span className={cl.tab__text}>{cat.attributes.title}</span>
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default Tabs;
