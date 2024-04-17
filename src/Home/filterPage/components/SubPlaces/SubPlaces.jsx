import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import cl from './SubPlaces.module.css';
import MySelectedButton from '../UI/MySelectedButton/MySelectedButton.jsx';
import axios from 'axios';
import { setSelectedSubsubcategory } from '../../../../actions.js';

const SubPlaces = ({ subcategoryId, activeCategory }) => {
    const [selectedButton, setSelectedButton] = useState(null);
    const [gl, setGl] = useState(null);
    const [data, setData] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        setSelectedButton(null); // Сбросить выбранную подподкатегорию при изменении активной категории
        setGl(null); // Сбросить данные о выбранной подподкатегории
        setData([]); // Сбросить данные о подподкатегориях
    }, [activeCategory]);

    const fetching = useCallback(async () => {
        if (subcategoryId) {
            const response = await axios.get(
                `https://spbneformal.fun/api/sub-categories/${subcategoryId}?populate=subsubcategories,subsubcategories.image`
            );
            setData(response.data || {});
            return response;
        }
    }, [subcategoryId]);

    useEffect(() => {
        fetching();
    }, [fetching]);

    useEffect(() => {
        const storedSubsubcategoryId = localStorage.getItem('selectedSubsubcategoryIdd');
        if (storedSubsubcategoryId !== null) {
            setSelectedButton(parseInt(storedSubsubcategoryId)); // Преобразуем значение в число
        }
    }, []);

    // Сохранение выбранной подподкатегории в localStorage
    useEffect(() => {
        if (selectedButton !== null) {
            localStorage.setItem('selectedSubsubcategoryIdd', selectedButton);
        }
    }, [selectedButton]);

    const handleButtonClick = useCallback((subcategory, index) => {
        if (selectedButton === index) {
            setSelectedButton(null); // Убираем активность, если кнопка уже была активной
            setGl(null);
            localStorage.removeItem('selectedSubsubcategoryIdd'); // Удаляем значение из localStorage
        } else {
            setSelectedButton(index);
            setGl(subcategory);
            localStorage.setItem('selectedSubsubcategoryIdd', index.toString());
        }
    }, [selectedButton]);

    dispatch(setSelectedSubsubcategory(gl));

    const subsubcategories = data?.data?.attributes?.subsubcategories?.data;

    if (!subcategoryId || !subsubcategories || subsubcategories.length === 0) {
        return null;
    }

    return (
        <div className={cl.button__select}>
            <div className={cl.button__select__row}>
                {subsubcategories.map((item, index) => (
                    <MySelectedButton
                        key={index}
                        onClick={() => handleButtonClick(item.id, index)}
                        isRed={selectedButton === index}
                    >
                        <img
                            className={cl.button__image}
                            src={`https://uploads.spbneformal.fun${item?.attributes?.image.data?.attributes?.url}`}
                            alt={`Изображение ${index}`}
                        />
                        {item?.attributes?.title}
                    </MySelectedButton>
                ))}
            </div>
        </div>
    );
};

export default SubPlaces;
