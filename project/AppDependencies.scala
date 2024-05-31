import sbt._

object AppDependencies {

  val compile = Seq(
    "uk.gov.hmrc"             %% "bootstrap-frontend-play-30" % "8.6.0",
    "uk.gov.hmrc"             %% "play-frontend-hmrc-play-30" % "9.11.0"
  )

  val test = Seq(
    "uk.gov.hmrc"             %% "bootstrap-test-play-30"     % "8.6.0"             % Test
  )

  val all: Seq[ModuleID] = compile ++ test
}
