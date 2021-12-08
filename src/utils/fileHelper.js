export const fileToString = async (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = ({ target: { result = null } }) => resolve(result);
    reader.onerror = () => resolve(null);
  });

export const filestringToArray = (str) => {
  const delimiter = str.indexOf(',') !== -1 ? ',' : ';';

  const headers = str.slice(0, str.indexOf('\n')).replace('\r', '').split(delimiter);
  const rows = str.slice(str.indexOf('\n') + 1).split('\n');

  const arr = rows.map((row) => {
    const values = row.split(delimiter);
    const el = headers.reduce((object, header, index) => {
      const obj = object;
      obj[header] = values[index];
      return obj;
    }, {});
    return el;
  });

  return arr;
};

export const deviceFilestringToArray = (str) => {
  const delimiter = str.indexOf(',') !== -1 ? ',' : ';';

  try {
    const rows = str.slice(str.indexOf('\n') + 1).split('\n');

    const arr = rows.map((row) => {
      const values = row.split(delimiter);
      return {
        SerialNumber: values[0],
        Name: values[1],
        Description: values[2],
        DeviceType: values[3],
        NoteText: values[4],
      };
    });

    return arr;
  } catch {
    return null;
  }
};
