import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectBasketCount, selectBasketItems } from "../../redux/basketSlice";

const Basket = () => {
  const dispatch = useDispatch();
  const basketItems = useSelector(selectBasketItems);
  const basketCount = useSelector(selectBasketCount);

  return (
    <div>
      <h3>Basket</h3>
      <p>Number of items in basket: {basketCount}</p>
      {!basketItems.length && <p>There are no items in your basket</p>}

      <table>
        <thead>
          <tr>
            <th>Item</th>
          </tr>
        </thead>

        <tbody>
          {basketItems.map((item, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.course_title}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Basket;
