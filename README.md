# Disco Planet | Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
| Aleksei Kashuba| 298846 |
| Ivan Yurov | 292453 |
| Ekaterina Svikhnushina | 292820 |

[Milestone 1](#milestone-1-friday-3rd-april-5pm) • [Milestone 2](#milestone-2-friday-1st-may-5pm) • [Milestone 3](#milestone-3-thursday-28th-may-5pm)

## Milestone 1 (Friday 3rd April, 5pm)
**10% of the final grade**

### Dataset
We retrieved our main dataset using the free public [Spotify API](https://developer.spotify.com/documentation/web-api/) and joined it with
[World Cities Database](https://simplemaps.com/data/world-cities) and ??TODO?? to
fetch geographic and demographic information for different cities.
We estimate the quality our data as high since we were in control of constructing
the dataset. The entity-relationship diagram of our database is illustrated below:

<img src="images/er_diagram.png" alt="ER Diagram" width="500"/>

Most of the data-cleaning was handled during the database construction phase.
Currently we have a huge number (see [Exploratory Data Analysis](#exploratory-data-analysis))
of various mucis genres in the dataset. We plan to reduce them to a reasonable
amount employing clusterization or some other approaches. Additionally, we
will need to come up with a metric to measure similarity between the cities
based on prevailing music genres and popular artists. This should be a relatively
easy task to handle.


### Problematic

The modern world offers us almost unlimited oppotrunities to choose products,
services, and way of life. Apparently, this abundance of alternatives may lead to
detrimental consequences to our psychological and emotional well-being [(Schwartz, 2004)](#Schwartz-2004). Frequent situation causing many of us to struggle occurs
when we try to pick a new travel destination. Luckily, according to the researchers,
narrowing the variety of options can remarkably relieve stress and axiety
imposed by choice overload [(Schwartz, 2004)](#Schwartz-2004).

While there are many factors influencing attractiveness of travel destinations for
tourists [(Sirgy, 2000)](#Sirgy-2000), we are confident that _music_ can effectively
mediate people's experience of a particular city or area of interest. Many of us have
subtle musical preferences, which closely relate to our personalities [(Greenberg, 2016)](#Greenberg-2016). Curiously, it is also possible to apply the concept of
personality to a place or city [(Demirbag, 2010)](#Demirbag-2010). The greater it
corresponds to our own personal traits, the more likely we develop a positive attitude
towards the desination [(Sirgy, 2000)](#Sirgy-2000). By building music profiles of
various cities based on their population's preferences we can provide a tool for
music-lovers to target their exploration of numerous vacation spots to presumably
more favorable options.

In a nutshell, the ideas above bring us to the following problem statement:

> Music-lovers puzzling over choices for their next vacation destination need a way to guide their search based on music profiles of the cities because musical preferences are linked to personality and when the destination personality matches our own, we are more likely to enjoy the visit.


### Exploratory Data Analysis
**TODO**

### Related work
- What others have already done with the data?
  - We collected the dataset by ourselves, so it is unique in this sense. Since the data
mostly come from Spotify, service developers might have used it for related projects. We
didn't find any interactive visualizations authored by Spotify team and addressing the
same user needs as indicated in [Problematic section](#problematic). The only somewhat
related visualization from Spotify is listed below as a source of inspiration.


- Why is your approach original?
  - Even though several attempts to visualize music profiles of cities were discussed
in literature [[(Hauger, 2016)](#Hauger-2016), [(Mellander, 2018)](#Mellander-2018)], to the
best of our knowledge no working solution exists. More importantly, nobody has ever
considered this problem from the perspective of the traveller searching for a new
vacation spot. We consider it to be a crusial factor for consideration in order to
design useful and easy to use application.


- What source of inspiration do you take?
  - Inspiration for visualization:
    - <a name="Hauger-2016"></a> Hauger, D., Schedl, M., 2016. Music Tweet Map: A browsing interface to explore the microblogosphere of music, in: 2016 14th International Workshop on Content-Based Multimedia Indexing (CBMI). Presented at the 2016 14th International Workshop on Content-Based Multimedia Indexing (CBMI), IEEE, Bucharest, Romania, pp. 1–4. https://doi.org/10.1109/CBMI.2016.7500277
    - [Music Tweet Map](http://www.cp.jku.at/projects/MusicTweetMap/)
    - [The one million tweet map](https://onemilliontweetmap.com/)
    - [What Type of Music Is Your City Most Passionate About?](https://time.com/37332/music-preference-maps/)
    - [Hoodmaps](https://hoodmaps.com/)
    - <a name="Mellander-2018"></a> Mellander, C., Florida, R., Rentfrow, P.J., Potter, J., 2018. The geography of music preferences. J Cult Econ 42, 593–618. https://doi.org/10.1007/s10824-018-9320-x
  - Other resources and references:
    - [Every Noise at Once](http://everynoise.com/)
    - <a name="Schwartz-2004"></a> Schwartz, B., 2004, January. The paradox of choice: Why more is less. New York: Ecco.
    - <a name="Sirgy-2000"></a> Sirgy, M.J., Su, C., 2000. Destination Image, Self-Congruity, and Travel Behavior: Toward an Integrative Model. Journal of Travel Research 38, 340–352. https://doi.org/10.1177/004728750003800402
    - <a name="Greenberg-2016"></a> Greenberg, D.M., Kosinski, M., Stillwell, D.J., Monteiro, B.L., Levitin, D.J., Rentfrow, P.J., 2016. The Song Is You: Preferences for Musical Attribute Dimensions Reflect Personality. Social Psychological and Personality Science 7, 597–605. https://doi.org/10.1177/1948550616641473
    - <a name="Demirbag-2010"></a> Demirbag, K.M., Yurt, O., Guneri, B., Kurtulus, K., 2010. Branding places: applying brand personality concept to cities. European Journal of Marketing 44, 1286–1304. https://doi.org/10.1108/03090561011062844


- This is the first project for which we use our dataset.

## Milestone 2 (Friday 1st May, 5pm)

**10% of the final grade**




## Milestone 3 (Thursday 28th May, 5pm)

**80% of the final grade**
