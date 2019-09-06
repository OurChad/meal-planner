import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Form from '../common/Form';

const FoodForm = ({ loading, food: foodProp, setFoodData, onSubmit, resetFormOnSubmit, title, submitLabel }) => {
  const foodTypes = [
    'BAKED',
    'CHEESE',
    'CONDIMENT',
    'DAIRY',
    'DRINK',
    'FRUIT',
    'MEAT',
    'OTHER',
    'TEA',
    'VEGETABLE',
  ];

  const emptyState = {
    name: '',
    subName: '',
    types: [],
    image: '',
  };

  const [food, setFood] = useState(foodProp);

  const saveToState = (e) => {
    let updatedFood;
    if (Array.isArray(e)) {
      updatedFood = { ...food, types: e.map((foodType) => foodType.value) };
      setFood(updatedFood);
    } else {
      updatedFood = { ...food, [e.target.name]: e.target.value };
      setFood(updatedFood);
    }

    setFoodData(updatedFood);
  };

  const uploadFile = async (e) => {
    const { files } = e.target;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'sickfits');
    data.append('folder', 'meal_planner/food');

    const res = await fetch('https://api.cloudinary.com/v1_1/ourchad/image/upload', {
      method: 'POST',
      body: data,
    });
    const file = await res.json();
    const updatedFood = {
      ...food,
      image: file.secure_url,
    };
    setFood(updatedFood);
    setFoodData(updatedFood);
  };

  const handleSubmit = (e) => {
    onSubmit(e);

    if (resetFormOnSubmit) {
      setFood(emptyState);
    }
  };

  return (
    <Form
      method="post"
      onSubmit={handleSubmit}
    >
      <fieldset disabled={loading} aria-busy={loading}>
        <h2>{title}</h2>
        <label htmlFor="name">
                Name
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={food.name}
            onChange={saveToState}
          />
        </label>
        <label htmlFor="subName">
                SubName
          <input
            type="text"
            name="subName"
            placeholder="SubName i.e. Minced for Beef"
            value={food.subName}
            onChange={saveToState}
          />
        </label>
        <label htmlFor="types">
                Types
          <Select
            id="multiSelect"
            name="types"
            isMulti
            options={foodTypes.map((foodType) => ({ value: foodType, label: foodType, key: foodType }))}
            value={food.types.map((foodType) => ({ value: foodType, label: foodType, key: foodType }))}
            onChange={saveToState}
          />
        </label>
        <label htmlFor="image">
                Image
          <input
            type="file"
            name="image"
            placeholder="Image for the food"
            onChange={uploadFile}
          />
          {food.image && (
            <img width="200" src={food.image} alt="Upload Preview" />
          )}
        </label>
        <button type="submit">{submitLabel}</button>
      </fieldset>
    </Form>
  );
};

FoodForm.propTypes = {
  loading: PropTypes.bool.isRequired,
  food: PropTypes.object.isRequired,
  setFoodData: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  resetFormOnSubmit: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  submitLabel: PropTypes.string.isRequired,
};


export default FoodForm;
