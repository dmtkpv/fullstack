<!--
    Styles
-->

<style lang="scss">



    // -----------------
    // Common
    // -----------------

    .HnmLwY {

        @include lg {

            display: flex;
            align-items: flex-start;
            gap: 24px;

            header .ui-button {
                display: none;
            }

        }

        article {
            margin-bottom: 24px;
            ol { margin: 0 }
            li, p { margin-top: 16px }
        }


    }



    // -----------------
    // Nav
    // -----------------

    .Njc2z5 {

        width: 320px;
        flex-shrink: 0;

        a:not(:last-child) {
            margin-bottom: 16px;
        }

        b {
            display: block;
        }

    }



</style>


<!--
    Template
-->

<template>
    <main class="HnmLwY container-md">

        <ui-responsive v-model="sidebar" v-bind="responsive" class="Njc2z5">
            <router-link to="#a1"><b>Artikel 1</b>Definities</router-link>
            <router-link to="#a2"><b>Artikel 2</b>Identiteit van de ondernemer</router-link>
            <router-link to="#a3"><b>Artikel 3</b>Toepasselijkheid</router-link>
            <router-link to="#a4"><b> Artikel 4</b>Het aanbod</router-link>
            <router-link to="#a5"><b>Artikel 5</b>De overeenkomst</router-link>
            <router-link to="#a6"><b>Artikel 6</b>Herroepingsrecht</router-link>
            <router-link to="#a7"><b>Artikel 7</b>Verplichtingen van de consument tijdens de bedenktijd</router-link>
            <router-link to="#a8"><b>Artikel 8</b>Uitoefening van het herroepingsrecht door de consument en kosten daarvan</router-link>
            <router-link to="#a9"><b>Artikel 9</b>Verplichtingen van de ondernemer bij herroeping</router-link>
            <router-link to="#a10"><b>Artikel 10</b>Uitsluiting herroepingsrecht</router-link>
            <router-link to="#a11"><b>Artikel 11</b>De prijs</router-link>
            <router-link to="#a12"><b>Artikel 12</b>Nakoming en extra garantie</router-link>
            <router-link to="#a13"><b>Artikel 13</b>Levering en uitvoering</router-link>
            <router-link to="#a14"><b>Artikel 14</b>Duurtransacties: duur, opzegging en verlenging</router-link>
            <router-link to="#a15"><b>Artikel 15</b>Betaling</router-link>
            <router-link to="#a16"><b>Artikel 16</b>Klachtenregeling</router-link>
            <router-link to="#a17"><b>Artikel 17</b>Geschillen</router-link>
            <router-link to="#a18"><b>Artikel 18</b>Aanvullende of afwijkende bepalingen</router-link>
            <router-link to="#a19"><b>Bijlage I</b>Modelformulier voor herroeping</router-link>
        </ui-responsive>

        <section>


            <!-- header -->

            <header class="heading">
                <h1 class="h3">Voorwaarden</h1>
                <ui-button text="Navigatie" @click="sidebar = !sidebar" />
            </header>


            <!-- 1 -->

            <article class="tile _padded" id="a1">
                <h2 class="h4">Artikel 1 - Definities</h2>
                <p>In deze voorwaarden wordt verstaan onder:</p>
                <ol>
                    <li><b>Aanvullende overeenkomst</b>: een overeenkomst waarbij de consument producten, digitale inhoud en/of diensten verwerft in verband met een overeenkomst op afstand en deze zaken, digitale inhoud en/of diensten door de ondernemer worden geleverd of door een derde partij op basis van een afspraak tussen die derde en de ondernemer;</li>
                    <li><b>Bedenktijd</b>: de termijn waarbinnen de consument gebruik kan maken van zijn herroepingsrecht;</li>
                    <li><b>Consument</b>: de natuurlijke persoon die niet handelt voor doeleinden die verband houden met zijn handels-, bedrijfs-, ambachts- of beroepsactiviteit;</li>
                    <li><b>Dag</b>: kalenderdag;</li>
                    <li><b>Digitale inhoud</b>: gegevens die in digitale vorm geproduceerd en geleverd worden;</li>
                    <li><b>Duurovereenkomst</b>: een overeenkomst die strekt tot de regelmatige levering van zaken, diensten en/of digitale inhoud gedurende een bepaalde periode;</li>
                    <li><b>Duurzame gegevensdrager</b>: elk hulpmiddel - waaronder ook begrepen e-mail - dat de consument of ondernemer in staat stelt om informatie die aan hem persoonlijk is gericht, op te slaan op een manier die toekomstige raadpleging of gebruik gedurende een periode die is afgestemd op het doel waarvoor de informatie is bestemd, en die ongewijzigde reproductie van de opgeslagen informatie mogelijk maakt;</li>
                    <li><b>Herroepingsrecht</b>: de mogelijkheid van de consument om binnen de bedenktijd af te zien van de overeenkomst op afstand;</li>
                    <li><b>Ondernemer</b>: de natuurlijke of rechtspersoon die producten, (toegang tot) digitale inhoud en/of diensten op afstand aan consumenten aanbiedt;</li>
                    <li><b>Overeenkomst op afstand</b>: een overeenkomst die tussen de ondernemer en de consument wordt gesloten in het kader van een georganiseerd systeem voor verkoop op afstand van producten, digitale inhoud en/of diensten, waarbij tot en met het sluiten van de overeenkomst uitsluitend of mede gebruik gemaakt wordt van één of meer technieken voor communicatie op afstand;</li>
                    <li><b>Modelformulier voor herroeping</b>: het in Bijlage I van deze voorwaarden opgenomen Europese modelformulier voor herroeping. Bijlage I hoeft niet ter beschikking te worden gesteld als de consument ter zake van zijn bestelling geen herroepingsrecht heeft;</li>
                    <li><b>Techniek voor communicatie op afstand</b>: middel dat kan worden gebruikt voor het sluiten van een overeenkomst, zonder dat consument en ondernemer gelijktijdig in dezelfde ruimte hoeven te zijn samengekomen.</li>
                </ol>
            </article>


            <!-- 2 -->

            <article class="tile _padded" id="a2">
                <h2 class="h4">Artikel 2 - Identiteit van de ondernemer</h2>
                <p>Stage App<br>Nieuwe Waalreseweg 189<br>5552 EJ Valkenswaard;</p>
            </article>


            <!-- 3 -->

            <article class="tile _padded" id="a3">
                <h2 class="h4">Artikel 3 - Toepasselijkheid</h2>
                <ol>
                    <li>Deze algemene voorwaarden zijn van toepassing op elk aanbod van de ondernemer en op elke tot stand gekomen overeenkomst op afstand tussen ondernemer en consument.</li>
                    <li>Voordat de overeenkomst op afstand wordt gesloten, wordt de tekst van deze algemene voorwaarden aan de consument beschikbaar gesteld. Indien dit redelijkerwijs niet mogelijk is, zal de ondernemer voordat de overeenkomst op afstand wordt gesloten, aangeven op welke wijze de algemene voorwaarden bij de ondernemer zijn in te zien en dat zij op verzoek van de consument zo spoedig mogelijk kosteloos worden toegezonden.</li>
                    <li>Indien de overeenkomst op afstand elektronisch wordt gesloten, kan in afwijking van het vorige lid en voordat de overeenkomst op afstand wordt gesloten, de tekst van deze algemene voorwaarden langs elektronische weg aan de consument ter beschikking worden gesteld op zodanige wijze dat deze door de consument op een eenvoudige manier kan worden opgeslagen op een duurzame gegevensdrager. Indien dit redelijkerwijs niet mogelijk is, zal voordat de overeenkomst op afstand wordt gesloten, worden aangegeven waar van de algemene voorwaarden langs elektronische weg kan worden kennisgenomen en dat zij op verzoek van de consument langs elektronische weg of op andere wijze kosteloos zullen worden toegezonden.</li>
                    <li>Voor het geval dat naast deze algemene voorwaarden tevens specifieke product- of dienstenvoorwaarden van toepassing zijn, is het tweede en derde lid van overeenkomstige toepassing en kan de consument zich in geval van tegenstrijdige voorwaarden steeds beroepen op de toepasselijke bepaling die voor hem het meest gunstig is.</li>
                </ol>
            </article>


            <!-- 4 -->

            <article class="tile _padded" id="a4">
                <h2 class="h4">Artikel 4 - Het aanbod</h2>
                <ol>
                    <li>Indien een aanbod een beperkte geldigheidsduur heeft of onder voorwaarden geschiedt, wordt dit nadrukkelijk in het aanbod vermeld.</li>
                    <li>Het aanbod bevat een volledige en nauwkeurige omschrijving van de aangeboden producten, digitale inhoud en/of diensten. De beschrijving is voldoende gedetailleerd om een goede beoordeling van het aanbod door de consument mogelijk te maken. Als de ondernemer gebruik maakt van afbeeldingen, zijn deze een waarheidsgetrouwe weergave van de aangeboden producten, diensten en/of digitale inhoud. Kennelijke vergissingen of kennelijke fouten in het aanbod binden de ondernemer niet.</li>
                    <li>Elk aanbod bevat zodanige informatie, dat voor de consument duidelijk is wat de rechten en verplichtingen zijn, die aan de aanvaarding van het aanbod zijn verbonden.</li>
                </ol>
            </article>


            <!-- 5 -->

            <article class="tile _padded" id="a5">
                <h2 class="h4">Artikel 5 - De overeenkomst</h2>
                <ol>
                    <li>De overeenkomst komt, onder voorbehoud van het bepaalde in lid 4, tot stand op het moment van aanvaarding door de consument van het aanbod en het voldoen aan de daarbij gestelde voorwaarden.</li>
                    <li>Indien de consument het aanbod langs elektronische weg heeft aanvaard, bevestigt de ondernemer onverwijld langs elektronische weg de ontvangst van de aanvaarding van het aanbod. Zolang de ontvangst van deze aanvaarding niet door de ondernemer is bevestigd, kan de consument de overeenkomst ontbinden.</li>
                    <li>Indien de overeenkomst elektronisch tot stand komt, treft de ondernemer passende technische en organisatorische maatregelen ter beveiliging van de elektronische overdracht van data en zorgt hij voor een veilige webomgeving. Indien de consument elektronisch kan betalen, zal de ondernemer daartoe passende veiligheidsmaatregelen in acht nemen.</li>
                    <li>De ondernemer kan zich binnen wettelijke kaders - op de hoogte stellen of de consument aan zijn betalingsverplichtingen kan voldoen, alsmede van al die feiten en factoren die van belang zijn voor een verantwoord aangaan van de overeenkomst op afstand. Indien de ondernemer op grond van dit onderzoek goede gronden heeft om de overeenkomst niet aan te gaan, is hij gerechtigd gemotiveerd een bestelling of aanvraag te weigeren of aan de uitvoering bijzondere voorwaarden te verbinden.</li>
                    <li>De ondernemer zal uiterlijk bij levering van het product, de dienst of digitale inhoud aan de consument de volgende informatie, schriftelijk of op zodanige wijze dat deze door de consument op een toegankelijke manier kan worden opgeslagen op een duurzame gegevensdrager, meesturen:
                        <ol type="a">
                            <li>het bezoekadres van de vestiging van de ondernemer waar de consument met klachten terecht kan;</li>
                            <li>de voorwaarden waaronder en de wijze waarop de consument van het herroepingsrecht gebruik kan maken, dan wel een duidelijke melding inzake het uitgesloten zijn van het herroepingsrecht;</li>
                            <li>de informatie over garanties en bestaande service na aankoop;</li>
                            <li>de prijs met inbegrip van alle belastingen van het product, dienst of digitale inhoud; voor zover van toepassing de kosten van aflevering; en de wijze van betaling, aflevering of uitvoering van de overeenkomst op afstand;</li>
                            <li>de vereisten voor opzegging van de overeenkomst indien de overeenkomst een duur heeft van meer dan één jaar of van onbepaalde duur is;</li>
                            <li>indien de consument een herroepingsrecht heeft, het modelformulier voor herroeping.</li>
                        </ol>
                    </li>
                    <li>In geval van een duurtransactie is de bepaling in het vorige lid slechts van toepassing op de eerste levering.</li>
                </ol>
            </article>


            <!-- 6 -->

            <article class="tile _padded" id="a6">
                <h2 class="h4">Artikel 6 - Herroepingsrecht</h2>
                <p><i>Bij producten:</i></p>
                <ol>
                    <li>De consument kan een overeenkomst met betrekking tot de aankoop van een product gedurende een bedenktijd van minimaal 14 dagen zonder opgave van redenen ontbinden. De ondernemer mag de consument vragen naar de reden van herroeping, maar deze niet tot opgave van zijn reden(en) verplichten.</li>
                    <li>De in lid 1 genoemde bedenktijd gaat in op de dag nadat de consument, of een vooraf door de consument aangewezen derde, die niet de vervoerder is, het product heeft ontvangen, of:
                        <ol type="a">
                            <li>als de consument in eenzelfde bestelling meerdere producten heeft besteld: de dag waarop de consument, of een door hem aangewezen derde, het laatste product heeft ontvangen. De ondernemer mag, mits hij de consument hier voorafgaand aan het bestelproces op duidelijke wijze over heeft geïnformeerd, een bestelling van meerdere producten met een verschillende levertijd weigeren.</li>
                            <li>als de levering van een product bestaat uit verschillende zendingen of onderdelen: de dag waarop de consument, of een door hem aangewezen derde, de laatste zending of het laatste onderdeel heeft ontvangen;</li>
                            <li>bij overeenkomsten voor regelmatige levering van producten gedurende een bepaalde periode: de dag waarop de consument, of een door hem aangewezen derde, het eerste product heeft ontvangen.</li>
                        </ol>
                    </li>
                </ol>
                <p><i>Bij diensten en digitale inhoud die niet op een materiële drager is geleverd:</i></p>
                <ol start="3">
                    <li>De consument kan een dienstenovereenkomst en een overeenkomst voor levering van digitale inhoud die niet op een materiële drager is geleverd gedurende minimaal 14 dagen zonder opgave van redenen ontbinden. De ondernemer mag de consument vragen naar de reden van herroeping, maar deze niet tot opgave van zijn reden(en) verplichten.</li>
                    <li>De in lid 3 genoemde bedenktijd gaat in op de dag die volgt op het sluiten van de overeenkomst.</li>
                </ol>
                <p><i>Verlengde bedenktijd voor producten, diensten en digitale inhoud die niet op een materiële drager is geleverd bij niet informeren over herroepingsrecht:</i></p>
                <ol start="5">
                    <li>Indien de ondernemer de consument de wettelijk verplichte informatie over het herroepingsrecht of het modelformulier voor herroeping niet heeft verstrekt, loopt de bedenktijd af twaalf maanden na het einde van de oorspronkelijke, overeenkomstig de vorige leden van dit artikel vastgestelde bedenktijd.</li>
                    <li>Indien de ondernemer de in het voorgaande lid bedoelde informatie aan de consument heeft verstrekt binnen twaalf maanden na de ingangsdatum van de oorspronkelijke bedenktijd, verstrijkt de bedenktijd 14 dagen na de dag waarop de consument die informatie heeft ontvangen.</li>
                </ol>
            </article>


            <!-- 7 -->

            <article class="tile _padded" id="a7">
                <h2 class="h4">Artikel 7 - Verplichtingen van de consument tijdens de bedenktijd</h2>
                <ol>
                    <li>Tijdens de bedenktijd zal de consument zorgvuldig omgaan met het product en de verpakking. Hij zal het product slechts uitpakken of gebruiken in de mate die nodig is om de aard, de kenmerken en de werking van het product vast te stellen. Het uitgangspunt hierbij is dat de consument het product slechts mag hanteren en inspecteren zoals hij dat in een winkel zou mogen doen.</li>
                    <li>De consument is alleen aansprakelijk voor waardevermindering van het product die het gevolg is van een manier van omgaan met het product die verder gaat dan toegestaan in lid 1.</li>
                    <li>De consument is niet aansprakelijk voor waardevermindering van het product als de ondernemer hem niet voor of bij het sluiten van de overeenkomst alle wettelijk verplichte informatie over het herroepingsrecht heeft verstrekt.</li>
                </ol>
            </article>


            <!-- 8 -->

            <article class="tile _padded" id="a8">
                <h2 class="h4">Artikel 8 - Uitoefening van het herroepingsrecht door de consument en kosten daarvan</h2>
                <ol>
                    <li>Als de consument gebruik maakt van zijn herroepingsrecht, meldt hij dit binnen de bedenktermijn door middel van het modelformulier voor herroeping of op andere ondubbelzinnige wijze aan de ondernemer.</li>
                    <li>Zo snel mogelijk, maar binnen 14 dagen vanaf de dag volgend op de in lid 1 bedoelde melding, zendt de consument het product terug, of overhandigt hij dit aan (een gemachtigde van) de ondernemer. Dit hoeft niet als de ondernemer heeft aangeboden het product zelf af te halen. De consument heeft de terugzendtermijn in elk geval in acht genomen als hij het product terugzendt voordat de bedenktijd is verstreken.</li>
                    <li>De consument zendt het product terug met alle geleverde toebehoren, indien redelijkerwijs mogelijk in originele staat en verpakking, en conform de door de ondernemer verstrekte redelijke en duidelijke instructies.</li>
                    <li>Het risico en de bewijslast voor de juiste en tijdige uitoefening van het herroepingsrecht ligt bij de consument.</li>
                    <li>De consument draagt de rechtstreekse kosten van het terugzenden van het product. Als de ondernemer niet heeft gemeld dat de consument deze kosten moet dragen of als de ondernemer aangeeft de kosten zelf te dragen, hoeft de consument de kosten voor terugzending niet te dragen.</li>
                    <li>Indien de consument herroept na eerst uitdrukkelijk te hebben verzocht dat de verrichting van de dienst of de levering van gas, water of elektriciteit die niet gereed voor verkoop zijn gemaakt in een beperkt volume of bepaalde hoeveelheid aanvangt tijdens de bedenktijd, is de consument de ondernemer een bedrag verschuldigd dat evenredig is aan dat gedeelte van de verbintenis dat door de ondernemer is nagekomen op het moment van herroeping, vergeleken met de volledige nakoming van de verbintenis.</li>
                    <li>De consument draagt geen kosten voor de uitvoering van diensten of de levering van water, gas of elektriciteit, die niet gereed voor verkoop zijn gemaakt in een beperkt volume of hoeveelheid, of tot levering van stadsverwarming, indien:
                        <ol type="a">
                            <li>de ondernemer de consument de wettelijk verplichte informatie over het herroepingsrecht, de kostenvergoeding bij herroeping of het modelformulier voor herroeping niet heeft verstrekt, of;</li>
                            <li>de consument niet uitdrukkelijk om de aanvang van de uitvoering van de dienst of levering van gas, water, elektriciteit of stadsverwarming tijdens de bedenktijd heeft verzocht.</li>
                        </ol>
                    </li>
                    <li>De consument draagt geen kosten voor de volledige of gedeeltelijke levering van niet op een materiële drager geleverde digitale inhoud, indien:
                        <ol type="a">
                            <li>hij voorafgaand aan de levering ervan niet uitdrukkelijk heeft ingestemd met het beginnen van de nakoming van de overeenkomst voor het einde van de bedenktijd;</li>
                            <li>hij niet heeft erkend zijn herroepingsrecht te verliezen bij het verlenen van zijn toestemming;</li>
                            <li>de ondernemer heeft nagelaten deze verklaring van de consument te bevestigen.</li>
                        </ol>
                    </li>
                    <li>Als de consument gebruik maakt van zijn herroepingsrecht, worden alle aanvullende overeenkomsten van rechtswege ontbonden.</li>
                </ol>
            </article>


            <!-- 9 -->

            <article class="tile _padded" id="a9">
                <h2 class="h4">Artikel 9 - Verplichtingen van de ondernemer bij herroeping</h2>
                <ol>
                    <li>Als de ondernemer de melding van herroeping door de consument op elektronische wijze mogelijk maakt, stuurt hij na ontvangst van deze melding onverwijld een ontvangstbevestiging.</li>
                    <li>De ondernemer vergoedt alle betalingen van de consument, inclusief eventuele leveringskosten door de ondernemer in rekening gebracht voor het geretourneerde product, onverwijld doch binnen 14 dagen volgend op de dag waarop de consument hem de herroeping meldt. Tenzij de ondernemer aanbiedt het product zelf af te halen, mag hij wachten met terugbetalen tot hij het product heeft ontvangen of tot de consument aantoont dat hij het product heeft teruggezonden, naar gelang welk tijdstip eerder valt.</li>
                    <li>De ondernemer gebruikt voor terugbetaling hetzelfde betaalmiddel dat de consument heeft gebruikt, tenzij de consument instemt met een andere methode. De terugbetaling is kosteloos voor de consument.</li>
                    <li>Als de consument heeft gekozen voor een duurdere methode van levering dan de goedkoopste standaardlevering, hoeft de ondernemer de bijkomende kosten voor de duurdere methode niet terug te betalen.</li>
                </ol>
            </article>


            <!-- 10 -->

            <article class="tile _padded" id="a10">
                <h2 class="h4">Artikel 10 - Uitsluiting herroepingsrecht</h2>
                <p>De ondernemer kan de navolgende producten en diensten uitsluiten van het herroepingsrecht, maar alleen als de ondernemer dit duidelijk bij het aanbod, althans tijdig voor het sluiten van de overeenkomst, heeft vermeld:</p>
                <ol>
                    <li>Producten of diensten waarvan de prijs gebonden is aan schommelingen op de financiële markt waarop de ondernemer geen invloed heeft en die zich binnen de herroepingstermijn kunnen voordoen;</li>
                    <li>Overeenkomsten die gesloten zijn tijdens een openbare veiling. Onder een openbare veiling wordt verstaan een verkoopmethode waarbij producten, digitale inhoud en/of diensten door de ondernemer worden aangeboden aan de consument die persoonlijk aanwezig is of de mogelijkheid krijgt persoonlijk aanwezig te zijn op de veiling, onder leiding van een veilingmeester, en waarbij de succesvolle bieder verplicht is de producten, digitale inhoud en/of diensten af te nemen;</li>
                    <li>Dienstenovereenkomsten, na volledige uitvoering van de dienst, maar alleen als:
                        <ol type="a">
                            <li>de uitvoering is begonnen met uitdrukkelijke voorafgaande instemming van de consument;</li>
                            <li>de consument heeft verklaard dat hij zijn herroepingsrecht verliest zodra de ondernemer de overeenkomst volledig heeft uitgevoerd;</li>
                        </ol>
                    </li>
                    <li>Pakketreizen als bedoeld in artikel 7:500 BW en overeenkomsten van personenvervoer;</li>
                    <li>Dienstenovereenkomsten voor terbeschikkingstelling van accommodatie, als in de overeenkomst een bepaalde datum of periode van uitvoering is voorzien en anders dan voor woondoeleinden, goederenvervoer, autoverhuurdiensten en catering;</li>
                    <li>Overeenkomsten met betrekking tot vrijetijdsbesteding, als in de overeenkomst een bepaalde datum of periode van uitvoering daarvan is voorzien;</li>
                    <li>Volgens specificaties van de consument vervaardigde producten, die niet geprefabriceerd zijn en die worden vervaardigd op basis van een individuele keuze of beslissing van de consument, of die duidelijk voor een specifieke persoon bestemd zijn;</li>
                    <li>Producten die snel bederven of een beperkte houdbaarheid hebben;</li>
                    <li>Verzegelde producten die om redenen van gezondheidsbescherming of hygiëne niet geschikt zijn om te worden teruggezonden en waarvan de verzegeling na levering is verbroken;</li>
                    <li>Producten die na levering door hun aard onherroepelijk vermengd zijn met andere producten;</li>
                    <li>Alcoholische dranken waarvan de prijs is overeengekomen bij het sluiten van de overeenkomst, maar waarvan de levering slechts kan plaatsvinden na 30 dagen, en waarvan de werkelijke waarde afhankelijk is van schommelingen van de markt waarop de ondernemer geen invloed heeft;</li>
                    <li>Verzegelde audio-, video-opnamen en computerprogrammatuur, waarvan de verzegeling na levering is verbroken;</li>
                    <li>Kranten, tijdschriften of magazines, met uitzondering van abonnementen hierop;</li>
                    <li>De levering van digitale inhoud anders dan op een materiële drager, maar alleen als:
                        <ol type="a">
                            <li>de uitvoering is begonnen met uitdrukkelijke voorafgaande instemming van de consument;</li>
                            <li>de consument heeft verklaard dat hij hiermee zijn herroepingsrecht verliest.</li>
                        </ol>
                    </li>
                </ol>
            </article>


            <!-- 11 -->

            <article class="tile _padded" id="a11">
                <h2 class="h4">Artikel 11 - De prijs</h2>
                <ol>
                    <li>Gedurende de in het aanbod vermelde geldigheidsduur worden de prijzen van de aangeboden producten en/of diensten niet verhoogd, behoudens prijswijzigingen als gevolg van veranderingen in btw-tarieven.</li>
                    <li>In afwijking van het vorige lid kan de ondernemer producten of diensten waarvan de prijzen gebonden zijn aan schommelingen op de financiële markt en waar de ondernemer geen invloed op heeft, met variabele prijzen aanbieden. Deze gebondenheid aan schommelingen en het feit dat eventueel vermelde prijzen richtprijzen zijn, worden bij het aanbod vermeld.</li>
                    <li>Prijsverhogingen binnen 30 dagen na de totstandkoming van de overeenkomst zijn alleen toegestaan indien zij het gevolg zijn van wettelijke regelingen of bepalingen.</li>
                    <li>Prijsverhogingen vanaf 30 dagen na de totstandkoming van de overeenkomst zijn alleen toegestaan indien de ondernemer dit bedongen heeft en:
                        <ol type="a">
                            <li>deze het gevolg zijn van wettelijke regelingen of bepalingen; of</li>
                            <li>de consument de bevoegdheid heeft de overeenkomst op te zeggen met ingang van de dag waarop de prijsverhoging ingaat.</li>
                        </ol>
                    </li>
                    <li>De in het aanbod van producten of diensten genoemde prijzen zijn inclusief btw.</li>
                </ol>
            </article>


            <!-- 12 -->

            <article class="tile _padded" id="a12">
                <h2 class="h4">Artikel 12 - Nakoming overeenkomst en extra garantie</h2>
                <ol>
                    <li>De ondernemer staat er voor in dat de producten en/of diensten voldoen aan de overeenkomst, de in het aanbod vermelde specificaties, aan de redelijke eisen van deugdelijkheid en/of bruikbaarheid en de op de datum van de totstandkoming van de overeenkomst bestaande wettelijke bepalingen en/of overheidsvoorschriften. Indien overeengekomen staat de ondernemer er tevens voor in dat het product geschikt is voor ander dan normaal gebruik.</li>
                    <li>Een door de ondernemer, diens toeleverancier, fabrikant of importeur verstrekte extra garantie beperkt nimmer de wettelijke rechten en vorderingen die de consument op grond van de overeenkomst tegenover de ondernemer kan doen gelden indien de ondernemer is tekortgeschoten in de nakoming van zijn deel van de overeenkomst.</li>
                    <li>Onder extra garantie wordt verstaan iedere verbintenis van de ondernemer, diens toeleverancier, importeur of producent waarin deze aan de consument bepaalde rechten of vorderingen toekent die verder gaan dan waartoe deze wettelijk verplicht is in geval hij is tekortgeschoten in de nakoming van zijn deel van de overeenkomst.</li>
                </ol>
            </article>


            <!-- 13 -->

            <article class="tile _padded" id="a13">
                <h2 class="h4">Artikel 13 - Levering en uitvoering</h2>
                <ol>
                    <li>De ondernemer zal de grootst mogelijke zorgvuldigheid in acht nemen bij het in ontvangst nemen en bij de uitvoering van bestellingen van producten en bij de beoordeling van aanvragen tot verlening van diensten.</li>
                    <li>Als plaats van levering geldt het adres dat de consument aan de ondernemer kenbaar heeft gemaakt.</li>
                    <li>Met inachtneming van hetgeen hierover in artikel 4 van deze algemene voorwaarden is vermeld, zal de ondernemer geaccepteerde bestellingen met bekwame spoed doch uiterlijk binnen 30 dagen uitvoeren, tenzij een andere leveringstermijn is overeengekomen. Indien de bezorging vertraging ondervindt, of indien een bestelling niet dan wel slechts gedeeltelijk kan worden uitgevoerd, ontvangt de consument hiervan uiterlijk 30 dagen nadat hij de bestelling geplaatst heeft bericht. De consument heeft in dat geval het recht om de overeenkomst zonder kosten te ontbinden en recht op eventuele schadevergoeding.</li>
                    <li>Na ontbinding conform het vorige lid zal de ondernemer het bedrag dat de consument betaald heeft onverwijld terugbetalen.</li>
                    <li>Het risico van beschadiging en/of vermissing van producten berust bij de ondernemer tot het moment van bezorging aan de consument of een vooraf aangewezen en aan de ondernemer bekend gemaakte vertegenwoordiger, tenzij uitdrukkelijk anders is overeengekomen.</li>
                </ol>
            </article>


            <!-- 14 -->

            <article class="tile _padded" id="a14">
                <h2 class="h4">Artikel 14 - Duurtransacties: duur, opzegging en verlenging</h2>
                <p><i>Opzegging:</i></p>
                <ol>
                    <li>De consument kan een overeenkomst die voor onbepaalde tijd is aangegaan en die strekt tot het geregeld afleveren van producten (elektriciteit daaronder begrepen) of diensten, te allen tijde opzeggen met inachtneming van daartoe overeengekomen opzeggingsregels en een opzegtermijn van ten hoogste één maand.</li>
                    <li>De consument kan een overeenkomst die voor bepaalde tijd is aangegaan en die strekt tot het geregeld afleveren van producten (elektriciteit daaronder begrepen) of diensten, te allen tijde tegen het einde van de bepaalde duur opzeggen met inachtneming van daartoe overeengekomen opzeggingsregels en een opzegtermijn van ten hoogste één maand.</li>
                    <li>De consument kan de in de vorige leden genoemde overeenkomsten:
                        <ul>
                            <li>te allen tijde opzeggen en niet beperkt worden tot opzegging op een bepaald tijdstip of in een bepaalde periode;</li>
                            <li>tenminste opzeggen op dezelfde wijze als zij door hem zijn aangegaan;</li>
                            <li>altijd opzeggen met dezelfde opzegtermijn als de ondernemer voor zichzelf heeft bedongen.</li>
                        </ul>
                    </li>
                </ol>
                <p><i>Verlenging:</i></p>
                <ol start="4">
                    <li>Een overeenkomst die voor bepaalde tijd is aangegaan en die strekt tot het geregeld afleveren van producten (elektriciteit daaronder begrepen) of diensten, mag niet stilzwijgend worden verlengd of vernieuwd voor een bepaalde duur.</li>
                    <li>In afwijking van het vorige lid mag een overeenkomst die voor bepaalde tijd is aangegaan en die strekt tot het geregeld afleveren van dag- nieuws- en weekbladen en tijdschriften stilzwijgend worden verlengd voor een bepaalde duur van maximaal drie maanden, als de consument deze verlengde overeenkomst tegen het einde van de verlenging kan opzeggen met een opzegtermijn van ten hoogste één maand.</li>
                    <li>Een overeenkomst die voor bepaalde tijd is aangegaan en die strekt tot het geregeld afleveren van producten of diensten, mag alleen stilzwijgend voor onbepaalde duur worden verlengd als de consument te allen tijde mag opzeggen met een opzegtermijn van ten hoogste één maand. De opzegtermijn is ten hoogste drie maanden in geval de overeenkomst strekt tot het geregeld, maar minder dan eenmaal per maand, afleveren van dag-, nieuws- en weekbladen en tijdschriften.</li>
                    <li>Een overeenkomst met beperkte duur tot het geregeld ter kennismaking afleveren van dag-, nieuws- en weekbladen en tijdschriften (proef- of kennismakingsabonnement) wordt niet stilzwijgend voortgezet en eindigt automatisch na afloop van de proef- of kennismakingsperiode.</li>
                </ol>
                <p><i>Duur:</i></p>
                <ol start="8">
                    <li>Als een overeenkomst een duur van meer dan een jaar heeft, mag de consument na een jaar de overeenkomst te allen tijde met een opzegtermijn van ten hoogste één maand opzeggen, tenzij de redelijkheid en billijkheid zich tegen opzegging vóór het einde van de overeengekomen duur verzetten.</li>
                </ol>
            </article>


            <!-- 15 -->

            <article class="tile _padded" id="a15">
                <h2 class="h4">Artikel 15 - Betaling</h2>
                <ol>
                    <li>Voor zover niet anders is bepaald in de overeenkomst of aanvullende voorwaarden, dienen de door de consument verschuldigde bedragen te worden voldaan binnen 14 dagen na het ingaan van de bedenktermijn, of bij het ontbreken van een bedenktermijn binnen 14 dagen na het sluiten van de overeenkomst. In geval van een overeenkomst tot het verlenen van een dienst, vangt deze termijn aan op de dag nadat de consument de bevestiging van de overeenkomst heeft ontvangen.</li>
                    <li>Bij de verkoop van producten aan consumenten mag de consument in algemene voorwaarden nimmer verplicht worden tot vooruitbetaling van meer dan 50%. Wanneer vooruitbetaling is bedongen, kan de consument geen enkel recht doen gelden aangaande de uitvoering van de desbetreffende bestelling of dienst(en), alvorens de bedongen vooruitbetaling heeft plaatsgevonden.</li>
                    <li>De consument heeft de plicht om onjuistheden in verstrekte of vermelde betaalgegevens onverwijld aan de ondernemer te melden.</li>
                    <li>Indien de consument niet tijdig aan zijn betalingsverplichting(en) voldoet, is deze, nadat hij door de ondernemer is gewezen op de te late betaling en de ondernemer de consument een termijn van 14 dagen heeft gegund om alsnog aan zijn betalingsverplichtingen te voldoen, na het uitblijven van betaling binnen deze 14-dagen-termijn, over het nog verschuldigde bedrag de wettelijke rente verschuldigd en is de ondernemer gerechtigd de door hem gemaakte buitengerechtelijke incassokosten in rekening te brengen. Deze incassokosten bedragen maximaal: 15% over openstaande bedragen tot € 2.500,=; 10% over de daaropvolgende € 2.500,= en 5% over de volgende € 5.000,= met een minimum van € 40,=. De ondernemer kan ten voordele van de consument afwijken van genoemde bedragen en percentages.</li>
                </ol>
            </article>


            <!-- 16 -->

            <article class="tile _padded" id="a16">
                <h2 class="h4">Artikel 16 - Klachtenregeling</h2>
                <ol>
                    <li>De ondernemer beschikt over een voldoende bekend gemaakte klachtenprocedure en behandelt de klacht overeenkomstig deze klachtenprocedure.</li>
                    <li>Klachten over de uitvoering van de overeenkomst moeten binnen bekwame tijd nadat de consument de gebreken heeft geconstateerd, volledig en duidelijk omschreven worden ingediend bij de ondernemer.</li>
                    <li>Bij de ondernemer ingediende klachten worden binnen een termijn van 14 dagen gerekend vanaf de datum van ontvangst beantwoord. Als een klacht een voorzienbaar langere verwerkingstijd vraagt, wordt door de ondernemer binnen de termijn van 14 dagen geantwoord met een bericht van ontvangst en een indicatie wanneer de consument een meer uitvoerig antwoord kan verwachten.</li>
                    <li>De consument dient de ondernemer in ieder geval 4 weken de tijd te geven om de klacht in onderling overleg op te lossen. Na deze termijn ontstaat een geschil dat vatbaar is voor de geschillenregeling.</li>
                </ol>
            </article>


            <!-- 17 -->

            <article class="tile _padded" id="a17">
                <h2 class="h4">Artikel 17 - Geschillen</h2>
                <ol>
                    <li>Op overeenkomsten tussen de ondernemer en de consument waarop deze algemene voorwaarden betrekking hebben, is uitsluitend Nederlands recht van toepassing.</li>
                </ol>
            </article>


            <!-- 18 -->

            <article class="tile _padded" id="a18">
                <h2 class="h4">Artikel 18 - Aanvullende of afwijkende bepalingen</h2>
                <p>Aanvullende dan wel van deze algemene voorwaarden afwijkende bepalingen mogen niet ten nadele van de consument zijn en dienen schriftelijk te worden vastgelegd dan wel op zodanige wijze dat deze door de consument op een toegankelijke manier kunnen worden opgeslagen op een duurzame gegevensdrager.</p>
            </article>


            <!-- 19 -->

            <article class="tile _padded" id="a19">
                <h2 class="h4">Bijlage I - Modelformulier voor herroeping</h2>
                <p><b>Modelformulier voor herroeping</b></p>
                <p>(dit formulier alleen invullen en terugzenden wanneer u de overeenkomst wilt herroepen)</p>
                <p>Ik/Wij* deel/delen* u hierbij mede, dat ik/wij* onze overeenkomst betreffende de verrichting van de volgende dienst: Vermelding in Stage App*, herroept/herroepen*</p>
                <p>Besteld op*/ontvangen op* [datum bestelling bij diensten of ontvangst bij producten]</p>
                <p>[Naam consumenten(en)]</p>
                <p>[Adres consument(en)]</p>
                <p><i>* Invullen wat van toepassing is.</i></p>
            </article>


            <!-- footer -->

            <landing-footer />


        </section>
    </main>
</template>


<!--
    Scripts
-->

<script setup>

    import { ref } from 'vue'
    import { useMeta } from '#app/services/utils.js'



    // -------------------
    // Options
    // -------------------

    defineOptions({
        texts: [
            'landing-footer'
        ]
    })



    // -------------------
    // Data
    // -------------------

    const sidebar = ref(false);

    const responsive = {
        type: 'ui-sidebar',
        lg: 'nav',
        options: {
            nav: {
                class: 'tile _padded'
            }
        }
    }

    useMeta();



</script>