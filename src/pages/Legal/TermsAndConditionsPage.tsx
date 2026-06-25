import LegalLayout from './LegalLayout'

// ── Local components ──────────────────────────────────────────────────────────

function Section({ number, title, children }: {
  number?: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h2 className="text-lg md:text-xl font-bold text-white mb-4 flex items-start gap-2.5">
        {number && <span className="text-brand-400 font-black flex-shrink-0">{number}.</span>}
        <span>{title}</span>
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-gray-200 mb-2.5">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function Body({ children }: { children: React.ReactNode }) {
  return <p className="text-slate-400 text-sm leading-relaxed">{children}</p>
}

function BulletList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm text-slate-400">
          <span className="w-1 h-1 rounded-full bg-brand-500 flex-shrink-0 mt-2" />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  )
}

function NumberedList({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
          <span className="text-brand-400 font-semibold flex-shrink-0 leading-relaxed">{i + 1}.</span>
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ol>
  )
}

function Def({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <p className="text-sm leading-relaxed">
      <span className="text-gray-200 font-semibold">{term}</span>
      <span className="text-slate-400"> {children}</span>
    </p>
  )
}

function MailLink({ address }: { address: string }) {
  return (
    <a
      href={`mailto:${address}`}
      className="text-brand-400 hover:text-brand-300 transition-colors"
    >
      {address}
    </a>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TermsAndConditionsPage() {
  return (
    <LegalLayout title="Términos y Condiciones" lastUpdated="Última actualización: 25 de junio de 2026">

      {/* Introducción */}
      <div className="space-y-4">
        <Body>
          Ubyca es una plataforma diseñada para crear, gestionar y compartir experiencias geolocalizadas.
          Estos Términos y Condiciones (en adelante, los «Términos») regulan la relación contractual entre
          Ubyca y todas las personas que acceden o utilizan la Plataforma.
        </Body>
        <Body>
          Queremos que este documento sea genuinamente útil: que explique con claridad qué puedes esperar
          de nosotros y qué esperamos de ti. No está redactado únicamente para limitar responsabilidades.
        </Body>
        <Body>
          Al acceder a la Plataforma o al crear una cuenta, aceptas íntegramente estos Términos. Si actúas
          en nombre de una empresa u organización, declaras contar con la autorización necesaria para
          vincularla con este acuerdo. Estos Términos deben leerse junto con la Política de Privacidad de
          Ubyca, que forma parte integral del marco jurídico aplicable.
        </Body>
      </div>

      {/* 1. Definiciones */}
      <Section number="1" title="Definiciones">
        <Body>
          Los siguientes términos tienen el significado que se indica. Los marcados con (*) son idénticos
          a los definidos en la Política de Privacidad de Ubyca y deben interpretarse de forma coherente
          con dicho documento.
        </Body>
        <div className="space-y-3 mt-3">
          <Def term="Plataforma (*):">
            el conjunto de servicios, aplicaciones, API y sistemas operados por Ubyca, incluyendo Ubyca
            Studio y las experiencias públicas generadas a través de él.
          </Def>
          <Def term="Studio:">
            la interfaz de administración web de Ubyca (Ubyca Studio), a través de la cual los Operadores
            crean, configuran, administran y publican experiencias geolocalizadas.
          </Def>
          <Def term="GeoPoint (*):">
            punto de interés geolocalizado configurado por un Operador, con una zona de activación
            geográfica (radio o polígono) y contenido o reglas asociadas.
          </Def>
          <Def term="Geocerca:">
            zona geográfica delimitada —por radio o polígono— que define el área de activación de uno
            o más GeoPoints dentro de un proyecto.
          </Def>
          <Def term="Validación de presencia (*):">
            proceso técnico mediante el cual la Plataforma determina si el dispositivo de un Visitante
            se encuentra dentro de la zona de activación de un GeoPoint.
          </Def>
          <Def term="Operador (*):">
            persona natural o jurídica que crea una cuenta en Studio para crear, configurar y publicar
            experiencias geolocalizadas. El Operador es la contraparte contractual principal de Ubyca.
          </Def>
          <Def term="Visitante (*):">
            persona que accede a una experiencia pública publicada por un Operador, sin necesidad de
            registrarse ni identificarse. El Visitante no es parte de este contrato.
          </Def>
          <Def term="Integrador (*):">
            desarrollador o empresa que consume la API pública de Ubyca mediante credenciales de acceso.
          </Def>
          <Def term="Cuenta:">
            el acceso individual a la Plataforma, creado mediante registro con correo electrónico y
            contraseña, o mediante los mecanismos de autenticación que Ubyca habilite.
          </Def>
          <Def term="Organización:">
            la unidad de trabajo creada por un Operador dentro de Studio, que agrupa proyectos, GeoPoints,
            miembros del equipo y configuraciones bajo un mismo espacio colaborativo.
          </Def>
          <Def term="Owner:">
            el Operador titular de una Organización. El Owner tiene las máximas atribuciones dentro de
            la Organización y es el responsable contractual del Equipo frente a Ubyca.
          </Def>
          <Def term="Equipo:">
            el conjunto de miembros asociados a una Organización, cada uno con un rol y nivel de acceso
            definido por el Owner o los administradores.
          </Def>
          <Def term="Credencial:">
            el par de identificadores criptográficos —clave pública y secreto— que autoriza el acceso
            de un Integrador a la API pública de Ubyca.
          </Def>
          <Def term="Contenido:">
            toda información, texto, imagen, video, URL, multimedia, configuración o dato cargado,
            publicado o creado por el Operador dentro de la Plataforma, incluyendo proyectos, GeoPoints
            y configuraciones de experiencias.
          </Def>
          <Def term="Plan:">
            la modalidad de suscripción contratada por el Operador, que determina las funcionalidades
            disponibles, los límites de uso y el precio aplicable.
          </Def>
          <Def term="Términos:">
            el presente documento, en su versión vigente a la fecha de uso de la Plataforma.
          </Def>
        </div>
      </Section>

      {/* 2. Descripción del Servicio */}
      <Section number="2" title="Descripción del Servicio">
        <Body>
          Ubyca proporciona a los Operadores las herramientas para crear, administrar y publicar
          experiencias geolocalizadas. A través de Studio, los Operadores pueden:
        </Body>
        <BulletList items={[
          'Crear y administrar proyectos con GeoPoints y Geocercas.',
          'Asociar contenido digital —URLs, texto, imágenes y multimedia— a ubicaciones físicas.',
          'Configurar la validación de presencia de Visitantes dentro de zonas geográficas.',
          'Publicar experiencias accesibles públicamente para Visitantes, sin que estos deban registrarse.',
          'Gestionar Equipos con roles diferenciados dentro de una Organización.',
          'Analizar métricas de visitas, presencia y actividad geolocalizada.',
          'Integrar funcionalidades de la Plataforma en sistemas externos mediante la API pública.',
        ]} />
        <Body>
          Ubyca puede incorporar nuevas funcionalidades, modificar las existentes o discontinuar algunas
          de ellas conforme a lo establecido en la Sección 12 de estos Términos.
        </Body>
      </Section>

      {/* 3. Registro y Cuenta */}
      <Section number="3" title="Registro y Cuenta">
        <Body>
          Para acceder a Studio y utilizar las funcionalidades de la Plataforma como Operador, es necesario
          crear una Cuenta. Al registrarse, el Operador declara:
        </Body>
        <BulletList items={[
          'Ser una persona natural mayor de 18 años, o una persona jurídica válidamente constituida, con capacidad legal para celebrar contratos.',
          'Proporcionar información veraz, completa y actualizada durante el registro y mantenerla actualizada.',
          'Mantener la confidencialidad de sus credenciales de acceso.',
          'No compartir el acceso a su Cuenta con terceros no autorizados.',
          'Notificar a Ubyca de inmediato ante cualquier acceso no autorizado a su Cuenta.',
        ]} />
        <Body>
          El Operador es responsable de toda la actividad realizada desde su Cuenta, incluyendo las
          acciones de los miembros de su Equipo, con independencia de si Ubyca fue notificada de dicha
          actividad.
        </Body>
        <Body>
          Ubyca se reserva el derecho de rechazar solicitudes de registro, cancelar Cuentas o limitar
          el acceso cuando existan indicios fundados de uso fraudulento, violación de estos Términos o
          riesgo técnico, legal o reputacional para la Plataforma.
        </Body>
      </Section>

      {/* 4. Organizaciones y Equipos */}
      <Section number="4" title="Organizaciones y Equipos">

        <SubSection title="4.1 Organizaciones">
          <Body>
            Al crear una Organización dentro de Studio, el Operador pasa a ser el Owner de dicha
            Organización. La Organización es la unidad contractual que determina el Plan aplicable,
            los límites de uso y las funcionalidades disponibles.
          </Body>
          <Body>
            Un Operador puede crear o pertenecer a más de una Organización. Cada Organización opera
            con su propio Plan, Equipo y configuración de forma independiente.
          </Body>
        </SubSection>

        <SubSection title="4.2 Equipos y roles">
          <Body>
            El Owner puede invitar a otros usuarios a unirse a su Organización como miembros del Equipo.
            Cada miembro recibe un rol que determina su nivel de acceso a los proyectos, GeoPoints,
            analytics y configuraciones de la Organización.
          </Body>
          <Body>
            Los miembros del Equipo aceptan estos Términos de manera individual al crear su Cuenta
            o al aceptar la invitación. Sin perjuicio de ello, el Owner es el responsable contractual
            ante Ubyca por las acciones de todos los miembros de su Organización.
          </Body>
        </SubSection>

        <SubSection title="4.3 Responsabilidad del Owner">
          <Body>
            El Owner es el responsable contractual principal frente a Ubyca por el uso de la Plataforma
            dentro de su Organización. Esta responsabilidad incluye:
          </Body>
          <BulletList items={[
            'Las acciones y el Contenido publicado por los miembros del Equipo.',
            'El cumplimiento de estos Términos por parte de todos los miembros de la Organización.',
            'Las obligaciones de pago del Plan contratado.',
            'La gestión de los accesos y la revocación oportuna de roles cuando corresponda.',
          ]} />
        </SubSection>

        <SubSection title="4.4 Transferencia de titularidad">
          <Body>
            El Owner puede transferir la titularidad de una Organización a otro miembro del Equipo con
            las atribuciones necesarias. Una vez efectuada la transferencia, el nuevo Owner asume todas
            las responsabilidades contractuales descritas en estos Términos.
          </Body>
        </SubSection>

      </Section>

      {/* 5. Credenciales y Acceso */}
      <Section number="5" title="Credenciales y Acceso">
        <Body>
          El Operador puede generar Credenciales desde Studio para integrar la Plataforma con sistemas
          externos. Estas Credenciales identifican al Operador o al Integrador ante la API de Ubyca.
        </Body>
        <Body>
          El Operador y el Integrador son responsables de:
        </Body>
        <BulletList items={[
          'Mantener la confidencialidad del secreto de cada Credencial.',
          'No compartir Credenciales con terceros no autorizados.',
          'Revocar de inmediato cualquier Credencial que pueda haber sido comprometida.',
          'Todas las acciones realizadas mediante Credenciales emitidas bajo su Cuenta.',
        ]} />
        <Body>
          Ubyca no almacena los secretos de las Credenciales en texto claro y no puede recuperarlos
          una vez generados. Si un secreto se pierde o compromete, el Operador debe revocar la
          Credencial y generar una nueva.
        </Body>
        <Body>
          Ubyca puede revocar Credenciales sin previo aviso cuando detecte un uso que infrinja estos
          Términos, represente un riesgo de seguridad o afecte la estabilidad de la Plataforma.
        </Body>
      </Section>

      {/* 6. API Pública */}
      <Section number="6" title="API Pública">
        <Body>
          La API pública de Ubyca permite a los Integradores validar la presencia de usuarios en
          GeoPoints y acceder a funcionalidades de la Plataforma desde sistemas externos. El uso de
          la API está sujeto a los presentes Términos y a las condiciones técnicas publicadas en la
          documentación oficial.
        </Body>

        <SubSection title="6.1 Cuotas y límites de uso">
          <Body>
            El acceso a la API puede estar sujeto a límites de tasa (rate limits) y cuotas de uso
            según el Plan contratado. Estos límites están descritos en el portal de desarrolladores
            de Ubyca. El uso que supere los límites aplicables podrá resultar en la suspensión temporal
            del acceso a la API sin previo aviso.
          </Body>
        </SubSection>

        <SubSection title="6.2 Versionamiento y deprecación">
          <Body>
            Ubyca puede publicar nuevas versiones de la API e introducir cambios en las existentes.
            Cuando Ubyca decida discontinuar una versión de la API, lo comunicará con al menos treinta
            (30) días de anticipación mediante la documentación oficial o por correo electrónico al
            Integrador, salvo que circunstancias técnicas o de seguridad urgentes justifiquen un
            plazo menor.
          </Body>
        </SubSection>

        <SubSection title="6.3 Obligaciones del Integrador">
          <Body>
            El Integrador que utiliza la API de Ubyca se compromete a:
          </Body>
          <BulletList items={[
            'Usar la API exclusivamente para los fines descritos en la documentación y en estos Términos.',
            'No transmitir a Ubyca datos de sus propios usuarios que no sean estrictamente necesarios para la validación de presencia.',
            'Actuar como Responsable del tratamiento de los datos de sus propios usuarios conforme a la normativa de protección de datos aplicable, y cumplir con las obligaciones que ello implica.',
            'Mantener la confidencialidad de las Credenciales conforme a la Sección 5.',
            'No utilizar la API para actividades que infrinjan los usos prohibidos establecidos en la Sección 9.',
          ]} />
        </SubSection>

      </Section>

      {/* 7. Licencias de Uso */}
      <Section number="7" title="Licencias de Uso">
        <Body>
          Ubyca otorga las siguientes licencias de uso de la Plataforma, que en todos los casos son
          limitadas, no exclusivas, no transferibles y revocables:
        </Body>

        <SubSection title="7.1 Licencia para Operadores">
          <Body>
            El Operador recibe una licencia para acceder y utilizar Studio con el fin de crear, configurar,
            administrar y publicar experiencias geolocalizadas, dentro de los límites del Plan contratado
            y en cumplimiento de estos Términos.
          </Body>
        </SubSection>

        <SubSection title="7.2 Licencia para Visitantes">
          <Body>
            El Visitante recibe una licencia para acceder a las experiencias públicas publicadas por los
            Operadores, exclusivamente mediante los canales habilitados por la Plataforma y para el uso
            personal no comercial de dichas experiencias.
          </Body>
        </SubSection>

        <SubSection title="7.3 Licencia para Integradores">
          <Body>
            El Integrador recibe una licencia para consumir la API pública de Ubyca mediante Credenciales
            válidas, con el fin de integrar funcionalidades de validación de presencia y datos
            geolocalizados en sus propios sistemas, dentro de los límites de uso establecidos.
          </Body>
        </SubSection>

        <SubSection title="7.4 Lo que estas licencias no incluyen">
          <Body>
            Ninguna de las licencias anteriores incluye el derecho a:
          </Body>
          <BulletList items={[
            'Copiar, reproducir, distribuir o revender la Plataforma o cualquier parte de ella.',
            'Realizar ingeniería inversa, descompilar o intentar acceder al código fuente de la Plataforma.',
            'Sublicenciar, transferir o ceder los derechos de uso a terceros sin autorización expresa de Ubyca.',
            'Utilizar la Plataforma para desarrollar productos o servicios que compitan directamente con ella.',
            'Eliminar o alterar los avisos de propiedad intelectual presentes en la Plataforma.',
          ]} />
        </SubSection>

      </Section>

      {/* 8. Contenido del Operador */}
      <Section number="8" title="Contenido del Operador">

        <SubSection title="8.1 Propiedad del Contenido">
          <Body>
            El Operador conserva todos los derechos de propiedad intelectual sobre el Contenido que
            cargue, cree o publique a través de la Plataforma. Ubyca no reclama titularidad sobre el
            Contenido del Operador.
          </Body>
        </SubSection>

        <SubSection title="8.2 Licencia del Operador a Ubyca">
          <Body>
            Al cargar Contenido en la Plataforma, el Operador concede a Ubyca una licencia mundial,
            libre de regalías, no exclusiva, sublicenciable e irrevocable durante la vigencia de estos
            Términos para almacenar, alojar, reproducir, procesar, transmitir, distribuir y mostrar
            técnicamente dicho Contenido, exclusivamente en la medida necesaria para prestar, operar
            y mejorar los Servicios.
          </Body>
          <Body>
            Esta licencia incluye el derecho de Ubyca a sublicenciarla a sus proveedores de
            infraestructura y servicios técnicos —como alojamiento, distribución de contenido y copias
            de seguridad— únicamente con esos fines.
          </Body>
          <Body>
            La licencia se extingue cuando el Operador elimina el Contenido de la Plataforma o cancela
            su Cuenta, sin perjuicio de que las copias técnicas de seguridad puedan persistir durante
            el período de retención establecido en la Política de Privacidad.
          </Body>
        </SubSection>

        <SubSection title="8.3 Declaraciones del Operador">
          <Body>
            El Operador declara y garantiza que:
          </Body>
          <BulletList items={[
            'Cuenta con todos los derechos necesarios sobre el Contenido que publica, incluyendo licencias de terceros cuando corresponda.',
            'El Contenido no infringe derechos de propiedad intelectual, marcas, patentes ni derechos de imagen de terceros.',
            'El Contenido cumple con la legislación aplicable en las jurisdicciones donde será accesible.',
            'Tiene el derecho de conceder a Ubyca la licencia descrita en la Sección 8.2.',
          ]} />
        </SubSection>

        <SubSection title="8.4 Remoción de Contenido">
          <Body>
            Ubyca puede remover o deshabilitar el acceso a Contenido que, a su juicio razonable,
            infrinja estos Términos, vulnere derechos de terceros o represente un riesgo legal, técnico
            o reputacional para la Plataforma. Cuando sea razonablemente posible, Ubyca notificará al
            Operador antes de proceder a la remoción.
          </Body>
        </SubSection>

        <SubSection title="8.5 Retroalimentación">
          <Body>
            Si el Operador o el Integrador proporciona comentarios, sugerencias o ideas sobre la
            Plataforma, Ubyca podrá utilizarlos libremente para mejorar los Servicios sin obligación
            de compensación ni de confidencialidad. El Operador garantiza que dicha retroalimentación
            no incluye información de terceros que no pueda compartir libremente.
          </Body>
        </SubSection>

      </Section>

      {/* 9. Usos Prohibidos */}
      <Section number="9" title="Usos Prohibidos">
        <Body>
          Está prohibido utilizar la Plataforma para:
        </Body>
        <BulletList items={[
          'Actividades ilegales o que constituyan delito conforme a la legislación aplicable.',
          'Publicar Contenido que infrinja derechos de propiedad intelectual, marcas, patentes o derechos de imagen de terceros.',
          'Publicar Contenido difamatorio, discriminatorio, que incite al odio o que atente contra la dignidad de las personas.',
          'Recopilar datos personales de Visitantes sin la base legal adecuada o sin informarles correctamente de conformidad con la Política de Privacidad.',
          'Falsificar, simular o manipular coordenadas GPS con el fin de aparentar presencia en una ubicación donde el dispositivo no se encuentra.',
          'Diseñar experiencias que engañen a los Visitantes sobre la naturaleza del servicio, el uso de datos de ubicación, las condiciones de acceso o los beneficios ofrecidos.',
          'Realizar ingeniería inversa, descompilar o intentar acceder al código fuente de la Plataforma.',
          'Intentar acceder sin autorización a Cuentas de otros Operadores o a sistemas internos de Ubyca.',
          'Utilizar bots, scripts automatizados o scrapers no autorizados para interactuar con la Plataforma o la API.',
          'Realizar acciones que afecten la estabilidad, disponibilidad o seguridad de la Plataforma.',
          'Suplantar la identidad de Ubyca, de otros Operadores o de personas reales.',
          'Sublicenciar, revender, transferir o ceder el acceso a la Plataforma a terceros sin autorización expresa de Ubyca.',
        ]} />
      </Section>

      {/* 10. Obligaciones del Operador frente a sus Visitantes */}
      <Section number="10" title="Obligaciones del Operador frente a sus Visitantes">
        <Body>
          Cuando el Operador utiliza la Plataforma para diseñar experiencias destinadas a Visitantes,
          asume las siguientes obligaciones:
        </Body>

        <SubSection title="10.1 Información sobre geolocalización">
          <Body>
            El Operador debe informar a sus Visitantes, de manera clara y accesible, que la experiencia
            requiere acceso al GPS del dispositivo y que Ubyca procesa datos de presencia en el contexto
            de la prestación del servicio. Las modalidades, bases legales y detalles técnicos de este
            tratamiento están descritos en la Política de Privacidad de Ubyca.
          </Body>
        </SubSection>

        <SubSection title="10.2 Base legal para el tratamiento de datos">
          <Body>
            El Operador es responsable de contar con la base legal que corresponda, conforme a la
            normativa de su jurisdicción, para el tratamiento de los datos de presencia de sus Visitantes.
            Esta obligación es independiente de la base legal que Ubyca utilice para tratar dichos datos
            en su propia calidad de Responsable o Encargado.
          </Body>
        </SubSection>

        <SubSection title="10.3 Diseño responsable de experiencias">
          <Body>
            El Operador no debe diseñar experiencias que engañen a los Visitantes sobre la naturaleza
            del servicio, el uso de datos de ubicación, las condiciones de acceso o los beneficios
            ofrecidos. Las experiencias deben reflejar fielmente lo que el Visitante recibirá al
            activarlas.
          </Body>
        </SubSection>

        <SubSection title="10.4 Cumplimiento en la jurisdicción del Operador">
          <Body>
            El Operador es responsable de cumplir la normativa aplicable en el país o jurisdicción
            donde opera y donde residen sus Visitantes, incluyendo la legislación de protección al
            consumidor, privacidad, publicidad y protección de datos personales.
          </Body>
        </SubSection>

      </Section>

      {/* 11. Disponibilidad del Servicio */}
      <Section number="11" title="Disponibilidad del Servicio">
        <Body>
          Ubyca realiza esfuerzos razonables para mantener la Plataforma disponible y funcional.
          Sin perjuicio de lo anterior:
        </Body>
        <BulletList items={[
          'La Plataforma puede presentar interrupciones temporales por mantenimiento programado, actualizaciones del sistema o eventos técnicos imprevistos.',
          'Las interrupciones planificadas serán comunicadas con anticipación razonable a través del sitio web o por correo electrónico a los Operadores afectados.',
          'Ubyca no garantiza disponibilidad ininterrumpida de la Plataforma ni de la API.',
          'La disponibilidad de las experiencias públicas depende también de la infraestructura de los proveedores de terceros que utiliza la Plataforma.',
        ]} />
        <Body>
          Ubyca no será responsable por interrupciones del servicio causadas por factores fuera de su
          control razonable, incluyendo fallas de proveedores de infraestructura, problemas de
          conectividad del usuario o eventos de fuerza mayor conforme a la Sección 25.
        </Body>
      </Section>

      {/* 12. Modificaciones de la Plataforma */}
      <Section number="12" title="Modificaciones de la Plataforma">
        <Body>
          Ubyca puede modificar, actualizar, agregar o discontinuar funcionalidades de la Plataforma
          en cualquier momento, con el fin de mejorar el servicio, incorporar nuevas capacidades o
          responder a cambios técnicos, legales o comerciales.
        </Body>
        <Body>
          Cuando Ubyca decida discontinuar una funcionalidad que sea parte sustancial del servicio
          contratado, lo comunicará a los Operadores afectados con al menos treinta (30) días de
          anticipación, salvo que circunstancias técnicas, legales o de seguridad urgentes justifiquen
          un plazo menor.
        </Body>
        <Body>
          Los cambios menores, las correcciones de errores y las mejoras de rendimiento no requieren
          notificación previa.
        </Body>
      </Section>

      {/* 13. Planes y Suscripciones */}
      <Section number="13" title="Planes y Suscripciones">
        <Body>
          La Plataforma puede incluir modalidades de acceso sin costo y planes de pago que habilitan
          funcionalidades adicionales, mayor capacidad de proyectos, GeoPoints, visitas y otras
          características. Las funcionalidades específicas y los límites de cada Plan están descritos
          en el sitio web de Ubyca y en Studio.
        </Body>
        <Body>
          El uso de la Plataforma dentro de los límites del Plan contratado es el único uso autorizado.
          La superación de dichos límites puede resultar en restricciones de acceso o en la necesidad
          de contratar un Plan superior. Ubyca puede modificar los límites y funcionalidades de cada
          Plan conforme a la Sección 16.
        </Body>
      </Section>

      {/* 14. Precios y Facturación */}
      <Section number="14" title="Precios y Facturación">

        <SubSection title="14.1 Precios">
          <Body>
            Los precios de los Planes de pago están expresados en la moneda indicada en la página de
            precios de Ubyca y pueden variar según la región de facturación. Los precios se muestran
            con o sin impuestos según lo indique la Plataforma al momento de la contratación.
          </Body>
        </SubSection>

        <SubSection title="14.2 Procesamiento de pagos">
          <Body>
            Los pagos son procesados por Paddle, nuestro proveedor externo de gestión de pagos y
            suscripciones. Al contratar un Plan de pago, el Operador acepta también las condiciones
            de servicio de Paddle aplicables a la transacción. Ubyca no almacena datos de tarjetas
            de crédito ni información bancaria del Operador.
          </Body>
        </SubSection>

        <SubSection title="14.3 Ciclo de facturación">
          <Body>
            Los Planes de pago se facturan por adelantado, mensual o anualmente, según la opción
            seleccionada por el Operador al momento de la contratación. La facturación comienza en
            la fecha de activación del Plan.
          </Body>
        </SubSection>

        <SubSection title="14.4 Renovación automática">
          <Body>
            Los Planes de pago se renuevan automáticamente al final de cada período de facturación,
            a menos que el Operador cancele su suscripción antes de la fecha de renovación. Ubyca
            enviará un aviso de renovación próxima a la dirección de correo electrónico registrada
            con anticipación razonable.
          </Body>
        </SubSection>

        <SubSection title="14.5 Período de gracia por impago">
          <Body>
            Si el cargo automático de renovación falla, Ubyca realizará intentos adicionales de cobro
            durante un período de gracia de hasta siete (7) días calendario. Si el pago no se
            regulariza en ese plazo, el acceso a las funcionalidades del Plan de pago podrá ser
            suspendido conforme a la Sección 20.
          </Body>
        </SubSection>

      </Section>

      {/* 15. Cambio de Plan */}
      <Section number="15" title="Cambio de Plan">

        <SubSection title="15.1 Upgrade">
          <Body>
            El Operador puede cambiar a un Plan superior (upgrade) en cualquier momento desde Studio.
            El acceso a las nuevas funcionalidades se habilita de inmediato. El ajuste de precio
            correspondiente al período restante del ciclo de facturación vigente se calculará de
            forma prorrateada.
          </Body>
        </SubSection>

        <SubSection title="15.2 Downgrade">
          <Body>
            El Operador puede cambiar a un Plan inferior (downgrade) antes de la fecha de renovación.
            El downgrade entra en vigencia al inicio del siguiente período de facturación. El Operador
            es responsable de verificar si sus proyectos, GeoPoints o datos superan los límites del
            nuevo Plan, y de realizar los ajustes necesarios antes de la fecha de entrada en vigor.
            Ubyca no elimina Contenido automáticamente como consecuencia de un downgrade, pero puede
            restringir el acceso a funcionalidades o datos que excedan los límites del nuevo Plan.
          </Body>
        </SubSection>

      </Section>

      {/* 16. Cambios de Precio */}
      <Section number="16" title="Cambios de Precio">
        <Body>
          Ubyca puede modificar los precios de los Planes en cualquier momento. Cuando un cambio de
          precio afecte a suscriptores activos, Ubyca lo comunicará con al menos treinta (30) días
          de anticipación a la próxima fecha de renovación, mediante correo electrónico o aviso dentro
          de Studio.
        </Body>
        <Body>
          Los cambios de precio no afectan retroactivamente los períodos ya pagados. Si el Operador
          no está de acuerdo con el nuevo precio, puede cancelar su suscripción antes de la fecha de
          renovación conforme a la Sección 17.
        </Body>
        <Body>
          Ubyca también puede modificar las funcionalidades incluidas en cada Plan o los límites de uso.
          Estos cambios se comunicarán conforme al mismo proceso aplicable a los cambios de precio.
        </Body>
      </Section>

      {/* 17. Cancelación por el Operador */}
      <Section number="17" title="Cancelación por el Operador">
        <Body>
          El Operador puede cancelar su suscripción en cualquier momento desde la configuración de su
          Cuenta en Studio o mediante solicitud a{' '}
          <MailLink address="contacto@ubyca.com" />.
        </Body>
        <Body>Al cancelar:</Body>
        <NumberedList items={[
          'El acceso a Studio con las funcionalidades del Plan pagado se mantendrá activo hasta el final del período de facturación ya abonado.',
          'Las experiencias públicas activas permanecerán accesibles para los Visitantes hasta el fin de dicho período.',
          'Una vez finalizado el período pagado, el acceso a las funcionalidades de pago quedará desactivado.',
          'El Operador tendrá treinta (30) días desde la desactivación para exportar sus datos. Transcurrido ese plazo, Ubyca procederá a eliminar el Contenido y los datos del Operador conforme a los períodos de retención establecidos en la Política de Privacidad.',
        ]} />
        <Body>
          La cancelación de la suscripción no genera reembolso proporcional por el período ya pagado,
          salvo lo dispuesto en la Sección 19.
        </Body>
      </Section>

      {/* 18. Offboarding y Exportación de Datos */}
      <Section number="18" title="Offboarding y Exportación de Datos">
        <Body>
          Ubyca proporciona herramientas de exportación dentro de Studio para que el Operador pueda
          recuperar su Contenido, proyectos y datos de analytics antes de cancelar su suscripción o
          durante el período de gracia post-cancelación.
        </Body>
        <Body>
          El Operador es responsable de exportar sus datos dentro del plazo de treinta (30) días
          descrito en la Sección 17. Ubyca no puede garantizar la recuperación de datos una vez
          transcurrido dicho plazo y ejecutada la eliminación definitiva.
        </Body>
        <Body>
          La eliminación de los datos del Operador se realiza conforme a los períodos de retención
          establecidos en la Política de Privacidad de Ubyca.
        </Body>
      </Section>

      {/* 19. Reembolsos */}
      <Section number="19" title="Reembolsos">
        <Body>
          Con carácter general, los pagos realizados a Ubyca no son reembolsables, incluyendo:
        </Body>
        <BulletList items={[
          'Períodos de suscripción activos no utilizados.',
          'Renovaciones automáticas ya procesadas.',
          'Servicios utilizados parcial o totalmente.',
          'Upgrades de Plan ya efectuados.',
        ]} />
        <Body>
          Ubyca evaluará solicitudes de reembolso en los siguientes casos excepcionales:
        </Body>
        <BulletList items={[
          'Cobros duplicados o errores de facturación atribuibles a Ubyca.',
          'Interrupciones prolongadas del servicio atribuibles exclusivamente a Ubyca que hayan afectado de forma significativa el uso del Plan contratado.',
          'Casos donde la legislación aplicable establezca el derecho de desistimiento u otros derechos de reembolso obligatorios.',
        ]} />
        <Body>
          Las solicitudes de reembolso deben dirigirse a{' '}
          <MailLink address="contacto@ubyca.com" />{' '}
          dentro de los treinta (30) días siguientes al cargo que se objeta.
        </Body>
      </Section>

      {/* 20. Suspensión por Ubyca */}
      <Section number="20" title="Suspensión por Ubyca">

        <SubSection title="20.1 Causales de suspensión">
          <Body>
            Ubyca puede suspender temporalmente el acceso a una Cuenta u Organización cuando:
          </Body>
          <BulletList items={[
            'El Operador incumpla estos Términos.',
            'El pago de una renovación no se regularice dentro del período de gracia establecido en la Sección 14.5.',
            'Se detecte actividad que represente un riesgo de seguridad, técnico o reputacional para la Plataforma.',
            'Ubyca reciba una orden, requerimiento o instrucción de autoridad competente.',
          ]} />
        </SubSection>

        <SubSection title="20.2 Proceso de suspensión">
          <Body>
            Salvo en situaciones de emergencia técnica o de seguridad que requieran acción inmediata,
            Ubyca notificará al Operador antes de proceder a la suspensión, indicando la causa y
            ofreciendo un plazo razonable para subsanarla.
          </Body>
          <Body>
            En los casos de suspensión de emergencia, Ubyca notificará al Operador tan pronto como
            sea razonablemente posible después de haber tomado las medidas necesarias.
          </Body>
        </SubSection>

        <SubSection title="20.3 Efectos de la suspensión">
          <Body>
            Durante la suspensión, el Operador puede perder el acceso a Studio y a sus datos.
            Las experiencias públicas activas pueden deshabilitarse. La suspensión no exime al
            Operador de sus obligaciones de pago por el período facturado.
          </Body>
          <Body>
            Ubyca puede reactivar el acceso una vez que la causa de la suspensión haya sido resuelta.
          </Body>
        </SubSection>

      </Section>

      {/* 21. Terminación por Ubyca */}
      <Section number="21" title="Terminación por Ubyca">
        <Body>
          Ubyca puede terminar definitivamente el acceso de un Operador a la Plataforma en los
          siguientes casos:
        </Body>
        <BulletList items={[
          'Incumplimiento grave o reiterado de estos Términos, incluyendo los usos prohibidos de la Sección 9.',
          'Publicación de Contenido que infrinja derechos de terceros y que el Operador no haya corregido tras la notificación de Ubyca.',
          'Conducta fraudulenta, suplantación de identidad o uso de la Plataforma para actividades ilegales.',
          'Impago persistente no regularizado después del proceso de suspensión.',
        ]} />
        <Body>
          Ubyca también puede terminar el servicio por razones comerciales sin causa específica, con
          un preaviso de treinta (30) días enviado al correo electrónico registrado. En este caso,
          se reembolsará la parte proporcional del período pagado no utilizado.
        </Body>
        <Body>
          Tras la terminación por cualquier causa, el Operador pierde el acceso a la Plataforma.
          Los datos serán eliminados conforme a la Política de Privacidad, respetando el período de
          gracia para exportación descrito en la Sección 17, salvo en casos de terminación por
          conducta fraudulenta o ilegal, donde Ubyca puede omitir dicho período a su discreción.
        </Body>
      </Section>

      {/* 22. Propiedad Intelectual */}
      <Section number="22" title="Propiedad Intelectual">

        <SubSection title="22.1 Propiedad de Ubyca">
          <Body>
            La Plataforma, Studio, el código fuente, la arquitectura, el diseño, la interfaz, la marca
            Ubyca, la documentación y cualquier otro elemento que componga los Servicios son propiedad
            exclusiva de Ubyca o de sus licenciantes. Todos los derechos sobre estos elementos están
            reservados.
          </Body>
          <Body>
            El uso de la Plataforma no transfiere al Operador, al Visitante ni al Integrador ningún
            derecho de propiedad intelectual sobre ninguno de los elementos mencionados.
          </Body>
        </SubSection>

        <SubSection title="22.2 Marca Ubyca">
          <Body>
            El Operador no puede utilizar la marca Ubyca, su logotipo ni ningún signo distintivo de
            Ubyca en materiales de marketing, productos, comunicaciones o cualquier otro contexto sin
            la autorización previa y escrita de Ubyca.
          </Body>
          <Body>
            Ubyca puede autorizar a Operadores a indicar que utilizan la Plataforma —mediante menciones
            como «Powered by Ubyca» o equivalentes— bajo las condiciones que establezca para cada caso.
          </Body>
        </SubSection>

        <SubSection title="22.3 Software de código abierto">
          <Body>
            La Plataforma puede incorporar componentes de software de código abierto sujetos a sus
            propias licencias. El uso de estos componentes no modifica los derechos de Ubyca descritos
            en la Sección 22.1 ni amplía los derechos de los usuarios sobre el resto de la Plataforma.
          </Body>
        </SubSection>

      </Section>

      {/* 23. Limitación de Responsabilidad */}
      <Section number="23" title="Limitación de Responsabilidad">

        <SubSection title="23.1 Exclusión de daños indirectos">
          <Body>
            En la máxima medida permitida por la legislación aplicable, Ubyca no será responsable por
            daños indirectos, incidentales, consecuenciales o especiales, ni por lucro cesante, pérdida
            de datos, pérdida de reputación o interrupciones del negocio, aunque Ubyca hubiera sido
            advertida de la posibilidad de dichos daños.
          </Body>
        </SubSection>

        <SubSection title="23.2 Exclusiones específicas">
          <Body>
            Sin perjuicio de lo anterior, Ubyca no asume responsabilidad por:
          </Body>
          <BulletList items={[
            'Errores o imprecisiones en los datos de geolocalización, dado que la precisión del GPS depende del dispositivo del usuario y de condiciones externas fuera del control de Ubyca.',
            'El Contenido publicado por los Operadores o el impacto de dicho Contenido sobre los Visitantes u otras personas.',
            'Las acciones u omisiones de proveedores de servicios de terceros, incluyendo proveedores de infraestructura, procesadores de pagos y servicios de mapas.',
            'El uso indebido de la Plataforma por parte del Operador, del Integrador o de sus respectivos Equipos.',
            'La pérdida de datos derivada de la eliminación voluntaria de la Cuenta, la cancelación del Plan o el vencimiento del período de gracia de exportación.',
          ]} />
        </SubSection>

        <SubSection title="23.3 Tope de responsabilidad">
          <Body>
            La responsabilidad total de Ubyca frente a un Operador o Integrador por todos los daños
            derivados del uso de la Plataforma no excederá, en ningún caso, del total de las sumas
            efectivamente pagadas por dicho Operador o Integrador a Ubyca durante los doce (12) meses
            inmediatamente anteriores al evento que dio origen a la reclamación.
          </Body>
          <Body>
            En el caso de Operadores que no hayan realizado pagos durante ese período, el tope de
            responsabilidad corresponderá al equivalente de un (1) mes del Plan de pago básico vigente
            al momento del evento.
          </Body>
        </SubSection>

        <SubSection title="23.4 Excepciones">
          <Body>
            Las limitaciones anteriores no aplican a los daños causados por dolo (conducta fraudulenta
            e intencional) de Ubyca, ni a los casos en que la legislación aplicable no permita la
            limitación o exclusión de responsabilidad, como ciertos supuestos de responsabilidad por
            daños a personas o derechos irrenunciables bajo el derecho chileno.
          </Body>
        </SubSection>

      </Section>

      {/* 24. Indemnización */}
      <Section number="24" title="Indemnización">
        <Body>
          El Operador acuerda defender, indemnizar y mantener indemne a Ubyca y a sus directivos,
          empleados, representantes y proveedores de servicio frente a cualquier reclamación, demanda,
          pérdida, responsabilidad, daño o gasto —incluyendo honorarios razonables de abogados— que
          surja de o esté relacionado con:
        </Body>
        <BulletList items={[
          'El Contenido publicado por el Operador en la Plataforma.',
          'El incumplimiento de estos Términos o de la legislación aplicable por parte del Operador o de los miembros de su Equipo.',
          'Las experiencias geolocalizadas diseñadas o publicadas por el Operador y su efecto sobre los Visitantes o terceros.',
          'La infracción de derechos de propiedad intelectual de terceros derivada del Contenido del Operador.',
          'El incumplimiento de las obligaciones del Operador respecto del tratamiento de datos de sus propios Visitantes.',
        ]} />
        <Body>
          Esta obligación de indemnización no aplica en la medida en que la reclamación derive de la
          negligencia o conducta dolosa de Ubyca.
        </Body>
      </Section>

      {/* 25. Fuerza Mayor */}
      <Section number="25" title="Fuerza Mayor">
        <Body>
          Ninguna de las partes será responsable por el incumplimiento de sus obligaciones cuando dicho
          incumplimiento sea causado por eventos fuera de su control razonable —fuerza mayor o caso
          fortuito conforme al derecho chileno—, incluyendo desastres naturales, cortes masivos de
          infraestructura de internet, conflictos armados, decisiones gubernamentales de emergencia
          u otros eventos imprevisibles e irresistibles.
        </Body>
        <Body>
          La parte afectada notificará a la otra tan pronto como sea razonablemente posible, indicando
          la naturaleza del evento y su impacto estimado sobre el servicio.
        </Body>
        <Body>
          Si la fuerza mayor se extiende por más de sesenta (60) días continuos, cualquiera de las
          partes podrá terminar el acuerdo mediante aviso escrito, sin responsabilidad por dicha
          terminación. En tal caso, Ubyca reembolsará la parte proporcional del período pagado
          no utilizado.
        </Body>
      </Section>

      {/* 26. Política de Privacidad */}
      <Section number="26" title="Política de Privacidad">
        <Body>
          El tratamiento de datos personales en el contexto del uso de la Plataforma se rige
          exclusivamente por la Política de Privacidad de Ubyca, disponible en el sitio web. La
          Política de Privacidad forma parte integral del marco jurídico aplicable a la relación
          entre Ubyca y los Operadores, Visitantes e Integradores.
        </Body>
        <Body>
          El Operador reconoce haber leído la Política de Privacidad y comprende que Ubyca puede
          actuar como Responsable del tratamiento de los datos de los Operadores y como Responsable
          o Encargado del tratamiento de ciertos datos técnicos de los Visitantes, según el rol que
          corresponda conforme a lo establecido en la Política de Privacidad.
        </Body>
        <Body>
          El Operador asume la responsabilidad de cumplir las obligaciones que le correspondan en
          materia de protección de datos personales respecto de sus propios Visitantes, conforme a
          la normativa aplicable en su jurisdicción.
        </Body>
        <Body>
          Los Integradores que transmiten datos de sus propios usuarios a la API de Ubyca actúan
          como Responsables del tratamiento de dichos datos y son los únicos responsables de contar
          con la base legal correspondiente y de cumplir con la normativa de protección de datos
          aplicable en su jurisdicción.
        </Body>
      </Section>

      {/* 27. Modificaciones de los Términos */}
      <Section number="27" title="Modificaciones de los Términos">
        <Body>
          Ubyca puede actualizar estos Términos para reflejar cambios en la Plataforma, en la normativa
          aplicable o en las condiciones comerciales. Las modificaciones que afecten materialmente los
          derechos u obligaciones de los Operadores serán comunicadas con al menos quince (15) días de
          anticipación a su entrada en vigencia, mediante correo electrónico o aviso dentro de Studio.
        </Body>
        <Body>
          La versión vigente de los Términos estará siempre disponible en el sitio web de Ubyca, con
          la fecha de actualización indicada en el encabezado del documento.
        </Body>
        <Body>
          El uso continuado de la Plataforma después de la fecha de entrada en vigencia de los nuevos
          Términos implica su aceptación. Si el Operador no está de acuerdo con las modificaciones,
          puede cancelar su Cuenta antes de dicha fecha conforme a la Sección 17.
        </Body>
      </Section>

      {/* 28. Ley Aplicable y Jurisdicción */}
      <Section number="28" title="Ley Aplicable y Jurisdicción">
        <Body>
          Estos Términos se regirán e interpretarán conforme a las leyes de la República de Chile.
        </Body>
        <Body>
          Cualquier controversia, conflicto o reclamación relacionada con estos Términos o con el uso
          de la Plataforma será sometida a la competencia de los tribunales ordinarios de justicia de
          Santiago de Chile, salvo que la legislación aplicable en el país de residencia del usuario
          establezca la competencia de tribunales locales de manera obligatoria e irrenunciable.
        </Body>
        <Body>
          Las partes procurarán resolver cualquier disputa de buena fe antes de recurrir a la vía
          judicial. Para ello, el Operador debe comunicarse con Ubyca en{' '}
          <MailLink address="contacto@ubyca.com" />{' '}
          indicando la naturaleza de la disputa, para que ambas partes evalúen una solución directa
          en un plazo razonable.
        </Body>
      </Section>

      {/* 29. Disposiciones Generales */}
      <Section number="29" title="Disposiciones Generales">

        <SubSection title="29.1 Acuerdo completo">
          <Body>
            Estos Términos, junto con la Política de Privacidad de Ubyca y cualquier condición adicional
            aplicable a funcionalidades específicas publicadas en la Plataforma, constituyen el acuerdo
            completo entre las partes respecto del uso de la Plataforma y reemplazan cualquier acuerdo
            previo sobre la misma materia.
          </Body>
        </SubSection>

        <SubSection title="29.2 Separabilidad">
          <Body>
            Si alguna disposición de estos Términos fuera declarada inválida, nula o inaplicable por
            un tribunal competente, dicha disposición se considerará separada del resto del acuerdo,
            que continuará vigente en su totalidad.
          </Body>
        </SubSection>

        <SubSection title="29.3 No renuncia">
          <Body>
            El hecho de que Ubyca no ejerza o no exija el cumplimiento de cualquier derecho o
            disposición de estos Términos en un momento determinado no implica la renuncia a dicho
            derecho o disposición para el futuro.
          </Body>
        </SubSection>

        <SubSection title="29.4 Cesión">
          <Body>
            El Operador no puede ceder, transferir ni delegar sus derechos u obligaciones bajo estos
            Términos a terceros sin el consentimiento previo y escrito de Ubyca. Ubyca puede ceder
            estos Términos o los derechos que de ellos se deriven, total o parcialmente, en el contexto
            de una fusión, adquisición, reorganización corporativa o venta de activos, sin necesidad
            de consentimiento del Operador. En tal caso, Ubyca notificará al Operador con anticipación
            razonable.
          </Body>
        </SubSection>

        <SubSection title="29.5 Idioma e interpretación">
          <Body>
            Estos Términos están redactados en español. En caso de traducción a otros idiomas para
            facilidad de lectura, la versión en español prevalecerá ante cualquier conflicto o
            ambigüedad.
          </Body>
        </SubSection>

        <SubSection title="29.6 Comunicaciones">
          <Body>
            Las comunicaciones de Ubyca al Operador se realizarán al correo electrónico registrado
            en la Cuenta o mediante avisos dentro de Studio. El Operador es responsable de mantener
            actualizada su dirección de correo electrónico. Se considera que una comunicación enviada
            al correo registrado ha sido recibida a las veinticuatro (24) horas de su envío.
          </Body>
        </SubSection>

      </Section>

      {/* 30. Identificación Legal y Contacto */}
      <Section number="30" title="Identificación Legal y Contacto">
        <Body>
          Ubyca es operada por:
        </Body>
        <div className="mt-3 space-y-1">
          <p className="text-sm text-gray-200 font-semibold">Decora Virtual SpA</p>
          <p className="text-sm text-slate-400">RUT: 77.193.246-0</p>
          <p className="text-sm text-slate-400">Camino del Marqués 2281, Lo Barnechea, Región Metropolitana, Chile</p>
        </div>
        <div className="mt-5">
          <a
            href="mailto:contacto@ubyca.com"
            className="inline-flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300 transition-colors"
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            contacto@ubyca.com
          </a>
        </div>
        <Body>
          Para consultas contractuales, solicitudes de soporte o comunicaciones formales relacionadas
          con estos Términos, el Operador puede contactar a Ubyca en la dirección indicada. Ubyca
          responderá dentro de un plazo razonable y, en cualquier caso, dentro de los treinta (30)
          días hábiles siguientes a la recepción de la solicitud.
        </Body>
      </Section>

      {/* Nota legal final */}
      <p className="text-slate-500 text-xs leading-relaxed italic border-t border-white/[0.06] pt-8">
        Estos Términos y Condiciones están redactados conforme a la legislación de la República de
        Chile y las buenas prácticas internacionales aplicables a plataformas SaaS B2B.
      </p>

    </LegalLayout>
  )
}
