import React from "react";
import ms from "./style.module.scss";
import viewChange from "../../assets/images/viewChange.png";
import filter from "../../assets/images/filters.png";
import {
  switchMode,
  switchFilterMenu,
} from "../../app/slices/toolsPanelSlice.ts";
import viewMode2 from "../../assets/images/viewChange2.png";
import reverseFilter from "../../assets/images/reverseFilter.png";
import { Sort } from "./Sort/index.tsx";
import { useAppSelector, useAppDispatch } from "../../hooks.ts";
import { RootState } from "../../app/store.ts";

export const ToolsPanel = () => {
  const currentCategory = useAppSelector((s: RootState) => s.navBar.subMenu);
  const dispatch = useAppDispatch();
  const mode = useAppSelector((s: RootState) => s.toolsPanel.isActiveViewMode);
  const isActiveFilterMenu = useAppSelector(
    (s: RootState) => s.toolsPanel.isActiveFilterMenu
  );

  return (
    <section className={ms.container}>
      <img
        onClick={() => dispatch(switchMode())}
        src={mode ? viewMode2 : viewChange}
        alt="viev.png"
        className={ms.container__view}
      />
      <Sort category={"products"} />
      <section
        className={ms.container__rectangle2}
        onClick={() => dispatch(switchFilterMenu())}
      >
        <img
          src={!isActiveFilterMenu ? filter : reverseFilter}
          alt="filter.png"
        />
      </section>
      <section className={ms.container__rectangle3}>
        <span style={{ marginLeft: 20 }}>Subcategory: </span>{" "}
        <span style={{ marginRight: 20 }}>
          {currentCategory
            .filter((i) => i.isActive)[0]
            ?.modalItems?.items.filter((i) => i?.isActive)[0]?.category
            ? currentCategory
                .filter((i) => i.isActive)[0]
                ?.modalItems?.items.filter((i) => i?.isActive)[0]?.category
            : "Empty..."}
        </span>
      </section>
    </section>
  );
};
