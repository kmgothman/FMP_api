let monthNameFromGiftDate = (giftDate) => {
    let months = ['','January','February','March','April','May','June','July','August','September','October','November','December']
    date = giftDate.split(' ')
    mdy=date[0].split('/')
    if (mdy[0].length === 1) {
        ym = mdy[2]+'0'+mdy[0]
    } else {ym = mdy[2]+mdy[0]}
    return months[Number(ym.slice(4))]+' '+ym.slice(0,4)
}

module.exports = monthNameFromGiftDate