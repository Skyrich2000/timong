import React, { useState, useRef, useEffect } from 'react';
import MonthBox from './MonthBox';
import moment from 'moment';
import { Year, Day } from 'src/Interface/DateType';
import { buildDate } from 'src/Utils';
import { useTheme, Box } from '@mui/material';
import { AutoSizer, List, WindowScroller } from 'react-virtualized';
import UserDrawer from 'src/Components/UserDrawer/UserDrawer';
import NumberEx from 'src/Common/NumberEx';
import { UserWithValid } from 'src/Interface/UserType';

const initialYear: Year = buildDate(moment());

const Monthly = () => {
  const theme = useTheme();
  const touchRef = useRef(null);
  const [year, setYear] = useState<Year>(initialYear);
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);
  const [isShow, setIsShow] = useState<boolean>(false);
  const [dayUsers, setDayUsers] = useState<UserWithValid[]>([]);
  const handleDrawerOpen = () => setIsShow(!isShow);
  const handleDrawerClose = () => setIsShow(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (touchRef.current && !touchRef.current.contains(event.target)) {
        if (isShow) setIsShow(false);
      }
    }
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [touchRef]);

  const drawerHandler = {
    handleDrawerOpen,
    setDayUsers,
    isShow,
    setSelectedDay,
  };

  const scrollListener = (params) => {
    if (params.scrollTop + params.clientHeight >= params.scrollHeight - 1000) {
      setYear((year) => [
        ...year,
        ...buildDate(year[year.length - 1].monthMoment.clone().add(1, 'M')),
      ]);
    }
  };
  const rowRenderer = ({ index, style }) => {
    const month = year[index];
    return (
      <div style={style} key={month.monthMoment.format('x') + index}>
        <MonthBox month={month} drawerHandler={drawerHandler} />
      </div>
    );
  };

  const getRowHeight = ({ index }) => {
    return 60 + year[index].week.length * 80 + 30;
  };

  /**
   * react-vertualized (https://bvaughn.github.io/react-virtualized/#/components/AutoSizer)
   *
   * WindowScroller props 의미
   * @param width : 너비
   * @param height: 높이
   * ㄴ 그려줄 data grid의 전체 사이즈라고 생각하면 편하다
   * @param isScrolling : 스크롤을 감지하는 상태값이다.
   * @param scrollTop : scrollTop을 바꿀 수 있는 변수 해당 값을 바꾸면 원하는 위치로 이동할 수 있다.
   * @param registerChild : registerChild를 활용해서 windowscroller의 자식 컴포넌트로 ref를 전달할 수 있다.
   * ref를 사용하지 않으면 windowscroller가 findDOMNode()를 호출하는데 이는 strict mode에서는 권장하지 않는 방식이기 때문에 ref를 사용하는 것이 적합하다.
   * 문제인지
   * @see https://github.com/bvaughn/react-virtualized/issues/1572
   * 해결책
   * @see https://github.com/bvaughn/react-virtualized/blob/master/docs/WindowScroller.md#render-props
   */
  return (
    <Box bgcolor={theme.myPalette.background}>
      <WindowScroller style={{ width: '100%' }}>
        {({ width, height, isScrolling, scrollTop, registerChild }) => (
          /**
           * WindowScroller 와 AutoSizer를 함께 쓰기 위해선, 아래왁 같은 방식을 활용한다.
           */
          <div ref={registerChild}>
            <AutoSizer>
              {() => (
                /**
                 * 해당 컴포넌트는 가변높이, 스크롤 감지 가능 List 컴포넌트에 대한 예시이다.
                 */
                <List
                  autoHeight
                  height={height}
                  isScrolling={isScrolling}
                  onScroll={scrollListener}
                  rowCount={year.length}
                  rowHeight={getRowHeight}
                  rowRenderer={rowRenderer}
                  scrollTop={scrollTop}
                  width={width}
                  style={{
                    maxWidth: NumberEx.calendarMaxWidth,
                  }} // 리스트 내부 너비의 최대값을 지정함 (grid를 정사각형으로 유도)
                />
              )}
            </AutoSizer>
          </div>
        )}
      </WindowScroller>
      <UserDrawer
        touchRef={touchRef}
        selectedDay={selectedDay}
        dayUsers={dayUsers}
        isShow={isShow}
        handleDrawerClose={handleDrawerClose}
      />
    </Box>
  );
};

export default Monthly;
