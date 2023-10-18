type TAny = ReturnType<JSON.values>;

interface ISvgComponentProps {
  width?: string | number;
  height?: string | number;
  color?: string;
  viewBox?: string;
  opacity?: string | number;
  className?: string;
}

type TComponent<T = {}> = React.FC<React.PropsWithChildren<T>>;
type TSvgComponent<T = {}> = IComponent<ISvgComponentProps & T>;
