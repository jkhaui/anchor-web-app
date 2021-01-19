import { Tooltip } from '@anchor-protocol/neumorphism-ui/components/Tooltip';
import { flat, pressed } from '@anchor-protocol/styled-neumorphism';
import c from 'color';
import { ReactElement, ReactNode, useMemo } from 'react';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer/polyfilled';

export interface TabProps<T> {
  className?: string;

  disabled?: boolean;

  /** Data */
  items: T[];

  /** Selected item of the items */
  selectedItem: T;

  /** Callback when an item selection */
  onChange: (nextItem: T) => void;

  /** Get the label string from the item */
  labelFunction: (item: T) => string;

  /** Get the primary key value from the item */
  keyFunction: (item: T) => string;

  tooltipFunction?: (item: T) => ReactNode;

  /** height value to change look */
  height?: number;

  fontSize?: number;

  borderRadius?: number;
}

const defaultHeight: number = 60;
const buttonPadding: number = 8; // top + bottom
const defaultFontSize: number = 20;
const defualtBorderRadius: number = 22;

function TabBase<T>({
  className,
  disabled,
  items,
  selectedItem,
  onChange,
  keyFunction,
  labelFunction,
  tooltipFunction,
  height = defaultHeight,
}: TabProps<T>) {
  const { ref: divRef, width = 500 } = useResizeObserver<HTMLDivElement>({});

  const itemWidth = useMemo(() => {
    return Math.floor(width / items.length);
  }, [items.length, width]);

  const currentItemIndex = useMemo(() => {
    return items.findIndex((item) => item === selectedItem) ?? 0;
  }, [items, selectedItem]);

  return (
    <div
      className={className}
      ref={divRef}
      aria-disabled={disabled || undefined}
    >
      <ul>
        {items.map((item, i) => {
          const button = (
            <li
              key={'tab-button' + keyFunction(item)}
              role="tab"
              style={{
                width: itemWidth,
                height,
                left: itemWidth * i,
                top: 0,
              }}
              aria-selected={
                selectedItem === item
                  ? keyFunction(item) === keyFunction(selectedItem)
                  : undefined
              }
              onClick={selectedItem === item ? undefined : () => onChange(item)}
            >
              {labelFunction(item)}
            </li>
          );

          const tooltipContent: ReactNode =
            tooltipFunction && tooltipFunction(item);

          return tooltipContent ? (
            <Tooltip
              key={'tab-button-tooltip' + keyFunction(item)}
              title={tooltipContent}
              placement="top"
            >
              {button}
            </Tooltip>
          ) : (
            button
          );
        })}
      </ul>

      <div
        style={{
          width: itemWidth,
          height,
          left: 0,
          top: 0,
          transform: `translateX(${itemWidth * currentItemIndex}px)`,
        }}
      >
        <div>{labelFunction(selectedItem)}</div>
      </div>
    </div>
  );
}

export const Tab: <T>(props: TabProps<T>) => ReactElement<TabProps<T>> = styled(
  TabBase,
)`
  border-radius: ${({ borderRadius = defualtBorderRadius }) => borderRadius}px;
  height: ${({ height = defaultHeight }) => height}px;

  color: ${({ theme }) => theme.textColor};

  ${({ theme }) =>
    pressed({
      color: theme.textInput.backgroundColor,
      backgroundColor: theme.backgroundColor,
      intensity: theme.intensity,
      distance: 1,
    })};

  position: relative;

  > ul {
    height: 100%;
    list-style: none;
    padding: 0;

    li {
      position: absolute;

      display: grid;
      place-items: center;

      user-select: none;
      cursor: pointer;

      font-size: ${({ fontSize = defaultFontSize }) => fontSize}px;
      color: ${({ theme }) => c(theme.textColor).alpha(0.3).string()};

      &:hover {
        color: ${({ theme }) => c(theme.textColor).alpha(0.7).string()};
        background-color: ${({ theme }) =>
          c(theme.actionButton.backgroundColor).alpha(0.05).string()};
      }

      &[aria-selected='true'] {
        //cursor: ;
        //pointer-events: none;
      }

      border-radius: ${({ borderRadius = defualtBorderRadius }) =>
        borderRadius}px;
    }
  }

  > div {
    position: absolute;

    user-select: none;
    pointer-events: none;

    will-change: transform;

    transition: transform 0.3s ease-in-out;

    padding: ${buttonPadding}px;

    > div {
      width: 100%;
      height: 100%;

      border-radius: ${({ borderRadius = defualtBorderRadius }) =>
        borderRadius - buttonPadding / 2}px;

      overflow: hidden;

      ${({ theme }) =>
        flat({
          color: theme.backgroundColor,
          backgroundColor: theme.textInput.backgroundColor,
          distance: 3,
          intensity: theme.intensity,
        })};

      font-size: ${({ fontSize = defaultFontSize }) => fontSize}px;
      font-weight: 700;

      display: grid;
      place-items: center;
    }
  }

  &[aria-disabled='true'] {
    pointer-events: none;
    opacity: 0.3;
  }
`;
