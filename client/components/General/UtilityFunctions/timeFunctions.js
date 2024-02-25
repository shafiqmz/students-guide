export function convertToDueByFormat(timestamp) {
    const dueDate = new Date(timestamp);
    const currentDate = new Date();
    
    const timeDifference = dueDate.getTime() - currentDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));
    
    if (daysDifference === 0) {
        return 'Due Today';
    } else if (daysDifference === 1) {
        return 'Due Tomorrow';
    } else if (daysDifference > 1) {
        return `Due in ${daysDifference} days`;
    } else {
        return 'Past Due';
    }
}