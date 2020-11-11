function getBooleanControlClassName(data: any, originalClassName: string | undefined, prefix: string, baseKey: string | undefined) {
    const id = baseKey ? `${baseKey}_` : '';
    const checkedCn = data ? `${id}${prefix}_checked` : '';
    const cn = `${checkedCn} ${originalClassName || ''}`.trim();
    return cn;
}

const formUtility = {
    getBooleanControlClassName
};

export default formUtility;
