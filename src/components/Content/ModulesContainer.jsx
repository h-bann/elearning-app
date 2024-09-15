import React, { useCallback, useEffect, useState } from "react";
import {
  selectModuleContent,
  setModuleProgress,
  selectEnrolledCourses,
  selectModuleProgress,
  selectActiveCourse,
} from "../../redux/coursesSlice";
import { url } from "../../config";
import { getFromLocal } from "../../storage";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import usePageBottom from "../../utils/hooks";
import ModuleTab from "./ModuleTab";
import Content from "./Content";

const ModulesContainer = () => {
  const dispatch = useDispatch();
  const enrolledCourses = useSelector(selectEnrolledCourses);
  const moduleContent = useSelector(selectModuleContent);
  const moduleProgress = useSelector(selectModuleProgress);
  const activeCourse = useSelector(selectActiveCourse);
  const [hideContent, setHideContent] = useState(false);
  const [activeModule, setActiveModule] = useState();
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);

  useEffect(() => {
    const getModuleProgress = async () => {
      try {
        const { data: userModuleProgress } = await axios.get(
          `${url}/courses/userProgress`,
          {
            headers: {
              token: getFromLocal("token"),
              id: enrolledCourses.course_id,
            },
          }
        );
        if (userModuleProgress.code === 1) {
          dispatch(setModuleProgress(userModuleProgress.message.module_ids));
        }
      } catch (error) {
        console.error("Failed to fetch module progress", error);
      }
    };
    getModuleProgress();
  }, [activeCourse]);

  const handleModuleClick = useCallback((item) => {
    // make modules toggle correctly in mobile view
    setActiveModule((prev) => (prev === item.id ? null : item.id));
  }, []);

  const onNextClick = async (item) => {
    setActiveModule(item.id + 1);
    dispatch(setModuleProgress(item.id));

    const { data } = await axios.patch(
      `${url}/courses/moduleProgress`,
      { moduleId: item.id, courseId: item.course_id },
      {
        headers: { token: getFromLocal("token") },
      }
    );
    console.log(data);

    const lastItem = enrolledCourses.modules.slice(-1);
    if (lastItem[0].id === item.id) {
      const { data: courseComplete } = await axios.patch(
        `${url}/courses/courseCompletion`,
        { courseId: item.course_id },
        { headers: { token: getFromLocal("token") } }
      );
      console.log(courseComplete);
    }
  };

  // when user clicks new module and state changes, scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeModule]);

  // set component's innerWidth state to the width of the window as it is resized by user
  // ! NEED TO OPTIMISE THIS TO STOP COMPONENT RE-RENDER
  useEffect(() => {
    window.addEventListener("resize", () => {
      setInnerWidth(window.innerWidth);
    });
  }, []);

  if (!enrolledCourses) {
    <p>Loading</p>;
  }

  const { modules } = enrolledCourses;
  let lastItem = modules?.slice(-1);

  // if window size less than 365 then render HTML option A
  if (innerWidth < 360) {
    return (
      <div className="main-container">
        <div className="modules-container-mobile">
          {modules?.map((modulesItem) => {
            return (
              <div className="module-card-mobile" key={modulesItem.id}>
                <ModuleTab
                  onModuleClick={handleModuleClick}
                  module={modulesItem}
                  moduleProgress={moduleProgress}
                  activeModule={activeModule}
                  isHidden={hideContent}
                />
                {activeModule === modulesItem.id && (
                  <Content
                    className={"content-mobile displayed"}
                    module={modulesItem}
                    lastItem={lastItem}
                    onNextClick={onNextClick}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="main-container-desktop">
      <div className="modules-container-desktop">
        {modules.map((modulesItem) => {
          return (
            <>
              <div key={modulesItem.id} className="module-card-desktop">
                <ModuleTab
                  onModuleClick={handleModuleClick}
                  module={modulesItem}
                  moduleProgress={moduleProgress}
                  activeModule={activeModule}
                  isHidden={hideContent}
                />
              </div>
            </>
          );
        })}
      </div>
      {modules.map((contentItem) => {
        if (activeModule === contentItem.id) {
          return (
            <div>
              <Content
                className={"content-desktop displayed"}
                module={contentItem}
                lastItem={lastItem}
                onNextClick={onNextClick}
              />
            </div>
          );
        }
      })}
    </div>
  );

  // otherwise, render HTML option B
  return (
    <div className="main-container-desktop">
      {enrolledCourses.map((enrolledCoursesItem) => {
        const { modules } = enrolledCoursesItem;
        return (
          enrolledCoursesItem.course_id === activeCourse &&
          modules.map((modulesItem) => {
            const lastItem = modules.slice(-1);
            return (
              <>
                <div className="modules-container-desktop">
                  <div
                    className="individual-module-desktop"
                    key={modulesItem.id}
                  >
                    <ModuleTab
                      onModuleClick={handleModuleClick}
                      module={modulesItem}
                      moduleProgress={moduleProgress}
                      activeModule={activeModule}
                      isHidden={hideContent}
                    />
                  </div>
                </div>
                <div className="content-container-desktop">
                  {activeModule === modulesItem.id && (
                    <Content
                      className={"content-desktop displayed"}
                      module={modulesItem}
                      lastItem={lastItem}
                      onNextClick={onNextClick}
                    />
                  )}
                </div>
              </>
            );
          })
        );
      })}
    </div>
  );
};

export default ModulesContainer;