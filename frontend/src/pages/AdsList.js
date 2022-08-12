import React from "react";

// This component is for providing 'ad-like' pictures beside the social media feed.

class AdsList extends React.Component {

    render() {
        const ads = this.props.data;

        return(
          <div>
              {
              ads.map((ads, index) => {
                  return (
                    <div className="Ad-segment" key={index}>
                        <img src={process.env.PUBLIC_URL + ads.link} alt={index} className="Ad-pic" key={index} />
                    </div>
                  );
              })
            }
          </div>  
        );
    }

}

export default AdsList;