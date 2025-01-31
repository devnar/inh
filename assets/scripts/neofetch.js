function neofetch(os) {
    const Neofetch = {};
  
    Neofetch.osList = {
      windows: {
        names: ["Windows"],
        ascii: `
  ################  ################
  ################  ################
  ################  ################
  ################  ################
  ################  ################
  ################  ################

  ################  ################
  ################  ################
  ################  ################
  ################  ################
  ################  ################
  ################  ################`
      },
      chrome: {
        names: ["Chrome", "Chrome OS"],
        ascii: `
              .,:loool:,.
          .,coooooooooooooc,.
       .,lllllllllllllllllllll,.
      ;ccccccccccccccccccccccccc;
    'ccccccccccccccccccccccccccccc.
   ,oo::::::::okO00000OOkkkkkkkkkkk:
  .ooool;;;;:xK0xxkxxxxxk0X000000000.
  :oooool;,;OKddddddddddX000000000d
  lllllool;lNlllllllllllllld000000000
  llllllll;oMddddddddddcoW000000000
  ;cllllllllXmc:::::::::c0X000000000d
  .ccccllllllONk;,;,;cxKK0000000000.
   .cccccclllllxOOOOkxO0000000000;
    .:ccccccccllllllllo0000000OOO,
      ,:ccccccccclllcd0000OOOOOOl.
        '::cccccccccmdOOOOOOOkx:.
          ..,::ccccxOOOkkko;.
              ..,:dOkxl:.`
      },
      linux: {
        names: ["Linux"],
        ascii: `
         _nnnn_
        dGGGGMMb
       @p~qp~~qMb
       M|@||@) M|
       @,----.JM|
      JS^\__/  qKL
     dZP        qKRb
    dZP          qKKb
   fZP            SMMb
   HZM            MMMM
   FqM            MMMM
 __| ".        |\dS"qML
 |    .       | ' \Zq
_)      \.___.,|     .'
\____   )MMMMMP|   .'
     \-'       \--' 
     `},
      mac: {
        names: ["Mac", "iOS"],
        ascii: `
                      c.'
                   ,xNMM.
                 .OMMMMo
                 lMM"
       .;loddo:.  .olloddol;.
     cKMMMMMMMMMMNWMMMMMMMMMM0:
   .KMMMMMMMMMMMMMMMMMMMMMMMWd.
   XMMMMMMMMMMMMMMMMMMMMMMMX.
   ;MMMMMMMMMMMMMMMMMMMMMMMM:
  :MMMMMMMMMMMMMMMMMMMMMMMM:
  .MMMMMMMMMMMMMMMMMMMMMMMMX.
   kMMMMMMMMMMMMMMMMMMMMMMMMWd.
   'XMMMMMMMMMMMMMMMMMMMMMMMMMMk
   'XMMMMMMMMMMMMMMMMMMMMMMMMK.
      mkMMMMMMMMMMMMMMMMMMMMMMd
      'XMMMMMMMMMMMMMMMMMMMMM
           XNNNMMMMMMMMK.Md 
               kNNNNNMM
      `},
      other: {
        names: ["Other"],
        ascii: ` 
 IIIII  NN    NN HH   HH 
  III   NNN   NN HH   HH 
  III   NN N  NN HHHHHHH 
  III   NN  N NN HH   HH 
 IIIII  NN    NN HH   HH 
        `}
    };
  
    Neofetch.getASCII = function (name) {
      for (let key in Neofetch.osList) {
        if (Neofetch.osList[key].names.includes(name)) {
          return Neofetch.osList[key].ascii;
        }
      }
      return Neofetch.osList.other.ascii;
    };
  
    const cfg = {
      os: "Unknown",
    };
    
    if (os == null) {
        if (navigator?.platform == "Win32") cfg.os = "Windows";
        if (navigator?.platform?.startsWith("Linux ")) cfg.os = "Linux";
        if (cfg?.os == "Linux" && navigator?.userAgent?.includes("CrOS")) cfg.os = "Chrome OS";
        if (navigator?.userAgent?.includes("Macintosh") && navigator?.userAgent?.includes("Mac OS")) cfg.os = "Mac";
    } else {
        cfg.os = os;
    }
    
  
    const output = Neofetch.getASCII(cfg.os);
    echo(output,true)
}

neofetch()