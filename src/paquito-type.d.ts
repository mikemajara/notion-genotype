type PaquitoType = {
  published: boolean;
  link: string;
  size:
    | {
        label: "md";
        color: "red";
      }
    | {
        label: "0-3";
        color: "default";
      }
    | {
        label: "3-12";
        color: "orange";
      };
};
